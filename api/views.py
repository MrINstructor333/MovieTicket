"""
Movie Ticket Booking System - API Views

DAR ES SALAAM INSTITUTE OF TECHNOLOGY
MODULE CODE: COU 07503
MODULE NAME: WEB APPLICATION DEVELOPMENT

This module contains all API views/endpoints for the Movie Ticket Booking System.
Implements CRUD operations for all entities and business logic.
"""

from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q, Count
from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta

from .models import User, Movie, Theater, Seat, Show, Booking, BookingSeat, Payment
from .serializers import (
    UserSerializer, UserRegistrationSerializer, ChangePasswordSerializer, LoginSerializer,
    MovieListSerializer, MovieDetailSerializer, MovieCreateUpdateSerializer,
    TheaterListSerializer, TheaterDetailSerializer, TheaterCreateUpdateSerializer,
    SeatSerializer, SeatCreateSerializer, SeatAvailabilitySerializer,
    ShowListSerializer, ShowDetailSerializer, ShowCreateUpdateSerializer,
    BookingListSerializer, BookingDetailSerializer, BookingCreateSerializer, BookingCancelSerializer,
    PaymentSerializer, PaymentCreateSerializer
)


# ==================== CUSTOM PERMISSIONS ====================

class IsAdminUser(permissions.BasePermission):
    """Permission class to check if user is admin"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission class to check if user is owner or admin"""
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.user == request.user


# ==================== AUTHENTICATION VIEWS ====================

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    POST /api/auth/register/
    Returns JWT tokens on successful registration.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    API endpoint for user login.
    POST /api/auth/login/
    Returns JWT tokens on successful authentication.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """
    API endpoint for user logout.
    POST /api/auth/logout/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for viewing and updating user profile.
    GET /api/auth/profile/
    PUT/PATCH /api/auth/profile/
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    API endpoint for changing password.
    POST /api/auth/change-password/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({
                'error': 'Old password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


# ==================== MOVIE VIEWS ====================

class MovieViewSet(viewsets.ModelViewSet):
    """
    API endpoint for movies.
    
    list: GET /api/movies/ - List all active movies
    retrieve: GET /api/movies/{id}/ - Get movie details
    create: POST /api/movies/ - Create movie (Admin only)
    update: PUT /api/movies/{id}/ - Update movie (Admin only)
    partial_update: PATCH /api/movies/{id}/ - Partial update (Admin only)
    destroy: DELETE /api/movies/{id}/ - Delete movie (Admin only)
    """
    queryset = Movie.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MovieListSerializer
        elif self.action == 'retrieve':
            return MovieDetailSerializer
        return MovieCreateUpdateSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Movie.objects.all()
        
        # Filter only active movies for non-admin users
        if not self.request.user.is_authenticated or self.request.user.role != 'admin':
            queryset = queryset.filter(is_active=True)
        
        # Filter by genre
        genre = self.request.query_params.get('genre', None)
        if genre:
            queryset = queryset.filter(genre=genre)
        
        # Filter by language
        language = self.request.query_params.get('language', None)
        if language:
            queryset = queryset.filter(language__icontains=language)
        
        # Search by title
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(title__icontains=search)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def shows(self, request, pk=None):
        """Get all shows for a specific movie"""
        movie = self.get_object()
        shows = movie.shows.filter(
            is_active=True,
            show_date__gte=timezone.now().date()
        )
        serializer = ShowListSerializer(shows, many=True)
        return Response(serializer.data)


# ==================== THEATER VIEWS ====================

class TheaterViewSet(viewsets.ModelViewSet):
    """
    API endpoint for theaters.
    
    list: GET /api/theaters/ - List all theaters
    retrieve: GET /api/theaters/{id}/ - Get theater details with seats
    create: POST /api/theaters/ - Create theater (Admin only)
    update: PUT /api/theaters/{id}/ - Update theater (Admin only)
    partial_update: PATCH /api/theaters/{id}/ - Partial update (Admin only)
    destroy: DELETE /api/theaters/{id}/ - Delete theater (Admin only)
    """
    queryset = Theater.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TheaterListSerializer
        elif self.action == 'retrieve':
            return TheaterDetailSerializer
        return TheaterCreateUpdateSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Theater.objects.all()
        
        if not self.request.user.is_authenticated or self.request.user.role != 'admin':
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def generate_seats(self, request, pk=None):
        """
        Generate seats for a theater.
        POST /api/theaters/{id}/generate_seats/
        
        Body: { "rows": 10, "seats_per_row": 10 }
        """
        theater = self.get_object()
        rows = request.data.get('rows', 10)
        seats_per_row = request.data.get('seats_per_row', 10)
        
        # Delete existing seats
        theater.seats.all().delete()
        
        # Generate new seats
        row_labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        seats_created = []
        
        for i in range(min(rows, 26)):
            row_label = row_labels[i]
            for j in range(1, seats_per_row + 1):
                seat_number = f"{row_label}{j}"
                
                # Determine seat type based on row
                if i < 2:
                    seat_type = 'vip'
                    price_multiplier = 1.5
                elif i < 5:
                    seat_type = 'premium'
                    price_multiplier = 1.25
                else:
                    seat_type = 'regular'
                    price_multiplier = 1.0
                
                seat = Seat.objects.create(
                    theater=theater,
                    seat_number=seat_number,
                    row=row_label,
                    seat_type=seat_type,
                    price_multiplier=price_multiplier
                )
                seats_created.append(seat)
        
        # Update total seats count
        theater.total_seats = len(seats_created)
        theater.save()
        
        return Response({
            'message': f'{len(seats_created)} seats generated successfully',
            'seats': SeatSerializer(seats_created, many=True).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def shows(self, request, pk=None):
        """Get all shows for a specific theater"""
        theater = self.get_object()
        shows = theater.shows.filter(
            is_active=True,
            show_date__gte=timezone.now().date()
        )
        serializer = ShowListSerializer(shows, many=True)
        return Response(serializer.data)


# ==================== SEAT VIEWS ====================

class SeatViewSet(viewsets.ModelViewSet):
    """
    API endpoint for seats.
    Admin only for create, update, delete operations.
    """
    queryset = Seat.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SeatCreateSerializer
        return SeatSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Seat.objects.all()
        
        theater_id = self.request.query_params.get('theater', None)
        if theater_id:
            queryset = queryset.filter(theater_id=theater_id)
        
        return queryset


# ==================== SHOW VIEWS ====================

class ShowViewSet(viewsets.ModelViewSet):
    """
    API endpoint for shows (movie showtimes).
    
    list: GET /api/shows/ - List all upcoming shows
    retrieve: GET /api/shows/{id}/ - Get show details with seat availability
    create: POST /api/shows/ - Create show (Admin only)
    update: PUT /api/shows/{id}/ - Update show (Admin only)
    partial_update: PATCH /api/shows/{id}/ - Partial update (Admin only)
    destroy: DELETE /api/shows/{id}/ - Delete show (Admin only)
    """
    queryset = Show.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ShowListSerializer
        elif self.action == 'retrieve':
            return ShowDetailSerializer
        return ShowCreateUpdateSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Show.objects.select_related('movie', 'theater')
        
        # Filter only active and future shows for non-admin users
        if not self.request.user.is_authenticated or self.request.user.role != 'admin':
            queryset = queryset.filter(
                is_active=True,
                show_date__gte=timezone.now().date()
            )
        
        # Filter by movie
        movie_id = self.request.query_params.get('movie', None)
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        
        # Filter by theater
        theater_id = self.request.query_params.get('theater', None)
        if theater_id:
            queryset = queryset.filter(theater_id=theater_id)
        
        # Filter by date
        date = self.request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(show_date=date)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def seats(self, request, pk=None):
        """Get seat availability for a show"""
        show = self.get_object()
        seats = show.theater.seats.filter(is_active=True)
        serializer = SeatAvailabilitySerializer(seats, many=True, context={'show': show})
        return Response(serializer.data)


# ==================== BOOKING VIEWS ====================

class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for bookings.
    
    list: GET /api/bookings/ - List user's bookings (or all for admin)
    retrieve: GET /api/bookings/{id}/ - Get booking details
    create: POST /api/bookings/ - Create a new booking
    """
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookingListSerializer
        elif self.action == 'retrieve':
            return BookingDetailSerializer
        elif self.action == 'create':
            return BookingCreateSerializer
        return BookingListSerializer
    
    def get_permissions(self):
        if self.action in ['destroy']:
            return [IsAdminUser()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin can see all bookings
        if user.role == 'admin':
            queryset = Booking.objects.all()
        else:
            queryset = Booking.objects.filter(user=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.select_related('user', 'show', 'show__movie', 'show__theater')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        
        return Response({
            'message': 'Booking created successfully',
            'booking': BookingDetailSerializer(booking).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel a booking.
        POST /api/bookings/{id}/cancel/
        """
        booking = self.get_object()
        
        # Check if user owns the booking or is admin
        if booking.user != request.user and request.user.role != 'admin':
            return Response({
                'error': 'You do not have permission to cancel this booking.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if booking can be cancelled
        if booking.status == 'cancelled':
            return Response({
                'error': 'Booking is already cancelled.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if booking.status == 'completed':
            return Response({
                'error': 'Cannot cancel a completed booking.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = BookingCancelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Cancel the booking
        booking.status = 'cancelled'
        booking.notes = f"Cancelled: {serializer.validated_data.get('reason', 'No reason provided')}"
        booking.save()
        
        # If payment exists, mark as refunded
        if hasattr(booking, 'payment'):
            booking.payment.payment_status = 'refunded'
            booking.payment.save()
        
        return Response({
            'message': 'Booking cancelled successfully',
            'booking': BookingDetailSerializer(booking).data
        }, status=status.HTTP_200_OK)


# ==================== PAYMENT VIEWS ====================

class PaymentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for payments.
    """
    serializer_class = PaymentSerializer
    
    def get_permissions(self):
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'admin':
            return Payment.objects.all()
        
        return Payment.objects.filter(booking__user=user)


class ProcessPaymentView(APIView):
    """
    API endpoint for processing payments.
    POST /api/payments/process/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        
        return Response({
            'message': 'Payment processed successfully',
            'payment': PaymentSerializer(payment).data,
            'booking': BookingDetailSerializer(payment.booking).data
        }, status=status.HTTP_200_OK)


# ==================== ADMIN DASHBOARD VIEWS ====================

class AdminDashboardView(APIView):
    """
    API endpoint for admin dashboard statistics.
    GET /api/admin/dashboard/
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        today = timezone.now().date()
        
        # Basic statistics
        total_users = User.objects.filter(role='customer').count()
        total_movies = Movie.objects.filter(is_active=True).count()
        total_theaters = Theater.objects.filter(is_active=True).count()
        total_bookings = Booking.objects.count()
        
        # Today's statistics
        today_bookings = Booking.objects.filter(booking_date__date=today).count()
        today_revenue = Payment.objects.filter(
            payment_status='completed',
            payment_date__date=today
        ).aggregate(total=models.Sum('amount'))['total'] or 0
        
        # Recent bookings
        recent_bookings = Booking.objects.select_related(
            'user', 'show__movie'
        ).order_by('-booking_date')[:10]
        
        # Upcoming shows
        upcoming_shows = Show.objects.filter(
            is_active=True,
            show_date__gte=today
        ).select_related('movie', 'theater').order_by('show_date', 'show_time')[:10]
        
        return Response({
            'statistics': {
                'total_users': total_users,
                'total_movies': total_movies,
                'total_theaters': total_theaters,
                'total_bookings': total_bookings,
                'today_bookings': today_bookings,
                'today_revenue': float(today_revenue),
            },
            'recent_bookings': BookingListSerializer(recent_bookings, many=True).data,
            'upcoming_shows': ShowListSerializer(upcoming_shows, many=True).data,
        })


class AdminUserManagementViewSet(viewsets.ModelViewSet):
    """
    API endpoint for admin to manage users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = User.objects.all()
        
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role)
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        
        return queryset


# ==================== UTILITY VIEWS ====================

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_root(request):
    """
    API root endpoint - provides information about available endpoints.
    """
    return Response({
        'name': 'Movie Ticket Booking System API',
        'version': '1.0.0',
        'description': 'Backend API for Movie Ticket Booking System',
        'developers': [
            'ANGEL FRIGIL KANJE (230242487064)',
            'MZALIWA KIBURUTA EDWARD (230242435865)',
            'DANIEL MAREGESI THOMAS (2102302229655)',
        ],
        'institution': 'DAR ES SALAAM INSTITUTE OF TECHNOLOGY',
        'module': 'COU 07503 - WEB APPLICATION DEVELOPMENT',
        'endpoints': {
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'profile': '/api/auth/profile/',
                'change_password': '/api/auth/change-password/',
            },
            'movies': '/api/movies/',
            'theaters': '/api/theaters/',
            'shows': '/api/shows/',
            'bookings': '/api/bookings/',
            'payments': '/api/payments/',
            'admin_dashboard': '/api/admin/dashboard/',
        }
    })
