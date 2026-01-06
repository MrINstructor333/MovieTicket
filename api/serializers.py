"""
Movie Ticket Booking System - API Serializers

DAR ES SALAAM INSTITUTE OF TECHNOLOGY
MODULE CODE: COU 07503
MODULE NAME: WEB APPLICATION DEVELOPMENT

Serializers convert complex data types (Django models) to JSON and vice versa.
These are used by Django REST Framework to handle API requests and responses.
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Movie, Theater, Seat, Show, Booking, BookingSeat, Payment


# ==================== USER SERIALIZERS ====================

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model - used for displaying user information"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'first_name', 
                  'last_name', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'phone']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='customer'  # Default role for new registrations
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password": "New password fields didn't match."
            })
        return attrs


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})


# ==================== MOVIE SERIALIZERS ====================

class MovieListSerializer(serializers.ModelSerializer):
    """Serializer for listing movies (minimal data)"""
    
    class Meta:
        model = Movie
        fields = ['id', 'title', 'genre', 'duration', 'language', 
                  'release_date', 'poster', 'poster_url', 'rating', 'is_active']


class MovieDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed movie view"""
    
    shows_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Movie
        fields = ['id', 'title', 'genre', 'duration', 'language', 'release_date',
                  'description', 'poster', 'poster_url', 'rating', 'is_active', 'shows_count',
                  'created_at', 'updated_at']
    
    def get_shows_count(self, obj):
        return obj.shows.filter(is_active=True).count()


class MovieCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating movies (Admin only)"""
    
    class Meta:
        model = Movie
        fields = ['title', 'genre', 'duration', 'language', 'release_date',
                  'description', 'poster', 'poster_url', 'rating', 'is_active']


# ==================== THEATER SERIALIZERS ====================

class TheaterListSerializer(serializers.ModelSerializer):
    """Serializer for listing theaters"""
    
    seats_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Theater
        fields = ['id', 'name', 'location', 'total_seats', 'seats_count', 'is_active']
    
    def get_seats_count(self, obj):
        return obj.seats.filter(is_active=True).count()


class TheaterDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed theater view"""
    
    seats = serializers.SerializerMethodField()
    
    class Meta:
        model = Theater
        fields = ['id', 'name', 'location', 'total_seats', 'description', 
                  'is_active', 'seats', 'created_at', 'updated_at']
    
    def get_seats(self, obj):
        seats = obj.seats.filter(is_active=True)
        return SeatSerializer(seats, many=True).data


class TheaterCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating theaters (Admin only)"""
    
    class Meta:
        model = Theater
        fields = ['name', 'location', 'total_seats', 'description', 'is_active']


# ==================== SEAT SERIALIZERS ====================

class SeatSerializer(serializers.ModelSerializer):
    """Serializer for Seat model"""
    
    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'row', 'seat_type', 'price_multiplier', 'is_active']


class SeatCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating seats"""
    
    class Meta:
        model = Seat
        fields = ['theater', 'seat_number', 'row', 'seat_type', 'price_multiplier', 'is_active']


class SeatAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for seat availability in a show"""
    
    is_available = serializers.SerializerMethodField()
    is_booked = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'row', 'seat_type', 'is_available', 'is_booked', 'final_price', 'price_multiplier']
    
    def get_is_available(self, obj):
        show = self.context.get('show')
        if show:
            booked_seat_ids = BookingSeat.objects.filter(
                booking__show=show,
                booking__status__in=['confirmed', 'pending']
            ).values_list('seat_id', flat=True)
            return obj.id not in booked_seat_ids
        return True
    
    def get_is_booked(self, obj):
        return not self.get_is_available(obj)
        return True
    
    def get_final_price(self, obj):
        show = self.context.get('show')
        if show:
            return float(show.base_price * obj.price_multiplier)
        return float(obj.price_multiplier)


# ==================== SHOW SERIALIZERS ====================

class ShowListSerializer(serializers.ModelSerializer):
    """Serializer for listing shows"""
    
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    theater_name = serializers.CharField(source='theater.name', read_only=True)
    available_seats = serializers.SerializerMethodField()
    
    class Meta:
        model = Show
        fields = ['id', 'movie', 'movie_title', 'theater', 'theater_name',
                  'show_date', 'show_time', 'base_price', 'available_seats', 'is_active']
    
    def get_available_seats(self, obj):
        return obj.get_available_seats().count()


class ShowDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed show view with seat availability"""
    
    movie = MovieListSerializer(read_only=True)
    theater = TheaterListSerializer(read_only=True)
    seats = serializers.SerializerMethodField()
    
    class Meta:
        model = Show
        fields = ['id', 'movie', 'theater', 'show_date', 'show_time', 
                  'base_price', 'is_active', 'seats', 'created_at', 'updated_at']
    
    def get_seats(self, obj):
        seats = obj.theater.seats.filter(is_active=True)
        return SeatAvailabilitySerializer(seats, many=True, context={'show': obj}).data


class ShowCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating shows (Admin only)"""
    
    class Meta:
        model = Show
        fields = ['movie', 'theater', 'show_date', 'show_time', 'base_price', 'is_active']
    
    def validate(self, attrs):
        # Check if there's already a show at the same theater, date, and time
        theater = attrs.get('theater')
        show_date = attrs.get('show_date')
        show_time = attrs.get('show_time')
        
        existing = Show.objects.filter(
            theater=theater,
            show_date=show_date,
            show_time=show_time
        )
        
        # If updating, exclude the current instance
        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)
        
        if existing.exists():
            raise serializers.ValidationError(
                "A show already exists at this theater, date, and time."
            )
        
        return attrs


# ==================== BOOKING SERIALIZERS ====================

class BookingSeatSerializer(serializers.ModelSerializer):
    """Serializer for BookingSeat model"""
    
    seat_number = serializers.CharField(source='seat.seat_number', read_only=True)
    seat_type = serializers.CharField(source='seat.seat_type', read_only=True)
    row = serializers.CharField(source='seat.row', read_only=True)
    
    class Meta:
        model = BookingSeat
        fields = ['id', 'seat', 'seat_number', 'row', 'seat_type', 'price']
        read_only_fields = ['price']


class BookingListSerializer(serializers.ModelSerializer):
    """Serializer for listing bookings"""
    
    movie_title = serializers.CharField(source='show.movie.title', read_only=True)
    theater_name = serializers.CharField(source='show.theater.name', read_only=True)
    show_date = serializers.DateField(source='show.show_date', read_only=True)
    show_time = serializers.TimeField(source='show.show_time', read_only=True)
    seats_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = ['id', 'booking_reference', 'movie_title', 'theater_name',
                  'show_date', 'show_time', 'seats_count', 'total_amount', 
                  'status', 'booking_date']
    
    def get_seats_count(self, obj):
        return obj.booking_seats.count()


class BookingDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed booking view"""
    
    user = UserSerializer(read_only=True)
    show = ShowListSerializer(read_only=True)
    seats = BookingSeatSerializer(source='booking_seats', many=True, read_only=True)
    payment = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = ['id', 'booking_reference', 'user', 'show', 'seats',
                  'total_amount', 'status', 'notes', 'payment', 
                  'booking_date', 'created_at', 'updated_at']
    
    def get_payment(self, obj):
        try:
            return PaymentSerializer(obj.payment).data
        except Payment.DoesNotExist:
            return None


class BookingCreateSerializer(serializers.Serializer):
    """Serializer for creating a new booking"""
    
    # Accept both 'show' and 'show_id' for flexibility
    show = serializers.IntegerField(required=False)
    show_id = serializers.IntegerField(required=False)
    # Accept both 'seats' and 'seat_ids' for flexibility
    seats = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        # Handle both 'show' and 'show_id'
        show_value = attrs.get('show') or attrs.get('show_id')
        if not show_value:
            raise serializers.ValidationError({"show": "Show ID is required."})
        
        # Handle both 'seats' and 'seat_ids'
        seat_values = attrs.get('seats') or attrs.get('seat_ids')
        if not seat_values or len(seat_values) == 0:
            raise serializers.ValidationError({"seats": "At least one seat is required."})
        
        # Normalize the attributes
        attrs['show_id'] = show_value
        attrs['seat_ids'] = seat_values
        
        return attrs
    
    def validate_show_id(self, value):
        if not value:
            return value
        try:
            show = Show.objects.get(pk=value, is_active=True)
        except Show.DoesNotExist:
            raise serializers.ValidationError("Show not found or not active.")
        return value
    
    def validate_seat_ids(self, value):
        if not value:
            return value
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate seats selected.")
        return value
    
    def validate(self, attrs):
        show = Show.objects.get(pk=attrs['show_id'])
        seat_ids = attrs['seat_ids']
        
        # Check if all seats belong to the show's theater
        seats = Seat.objects.filter(
            pk__in=seat_ids, 
            theater=show.theater, 
            is_active=True
        )
        
        if seats.count() != len(seat_ids):
            raise serializers.ValidationError({
                "seat_ids": "Some seats are invalid or don't belong to this theater."
            })
        
        # Check if any seats are already booked
        booked_seats = BookingSeat.objects.filter(
            seat_id__in=seat_ids,
            booking__show=show,
            booking__status__in=['confirmed', 'pending']
        ).values_list('seat_id', flat=True)
        
        if booked_seats:
            raise serializers.ValidationError({
                "seat_ids": f"Seats {list(booked_seats)} are already booked."
            })
        
        attrs['show'] = show
        attrs['seats'] = seats
        return attrs
    
    def create(self, validated_data):
        user = self.context['request'].user
        show = validated_data['show']
        seats = validated_data['seats']
        notes = validated_data.get('notes', '')
        
        # Calculate total amount
        total_amount = sum(show.base_price * seat.price_multiplier for seat in seats)
        
        # Create booking
        booking = Booking.objects.create(
            user=user,
            show=show,
            total_amount=total_amount,
            notes=notes
        )
        
        # Create booking seats
        for seat in seats:
            BookingSeat.objects.create(
                booking=booking,
                seat=seat,
                price=show.base_price * seat.price_multiplier
            )
        
        return booking


class BookingCancelSerializer(serializers.Serializer):
    """Serializer for cancelling a booking"""
    
    reason = serializers.CharField(required=False, allow_blank=True)


# ==================== PAYMENT SERIALIZERS ====================

class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'booking', 'booking_reference', 'payment_method', 
                  'payment_status', 'transaction_id', 'amount', 'payment_date',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'booking', 'amount', 'payment_date', 'created_at', 'updated_at']


class PaymentCreateSerializer(serializers.Serializer):
    """Serializer for creating/processing a payment"""
    
    booking_id = serializers.IntegerField(required=True)
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHOD_CHOICES)
    transaction_id = serializers.CharField(required=False, allow_blank=True)
    
    def validate_booking_id(self, value):
        user = self.context['request'].user
        try:
            booking = Booking.objects.get(pk=value, user=user)
        except Booking.DoesNotExist:
            raise serializers.ValidationError("Booking not found.")
        
        if booking.status == 'cancelled':
            raise serializers.ValidationError("Cannot pay for a cancelled booking.")
        
        if booking.status == 'confirmed':
            raise serializers.ValidationError("Booking is already confirmed.")
        
        # Check if payment already exists
        if hasattr(booking, 'payment') and booking.payment.payment_status == 'completed':
            raise serializers.ValidationError("Payment has already been completed.")
        
        return value
    
    def create(self, validated_data):
        booking = Booking.objects.get(pk=validated_data['booking_id'])
        
        # Create or update payment
        payment, created = Payment.objects.update_or_create(
            booking=booking,
            defaults={
                'payment_method': validated_data['payment_method'],
                'transaction_id': validated_data.get('transaction_id', ''),
                'amount': booking.total_amount,
                'payment_status': 'completed'  # Auto-confirm for demo purposes
            }
        )
        
        return payment
