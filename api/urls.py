"""
Movie Ticket Booking System - API URL Configuration

All API endpoints are defined here using Django REST Framework routers.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from . import views

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'movies', views.MovieViewSet, basename='movie')
router.register(r'theaters', views.TheaterViewSet, basename='theater')
router.register(r'seats', views.SeatViewSet, basename='seat')
router.register(r'shows', views.ShowViewSet, basename='show')
router.register(r'bookings', views.BookingViewSet, basename='booking')
router.register(r'payments', views.PaymentViewSet, basename='payment')
router.register(r'admin/users', views.AdminUserManagementViewSet, basename='admin-user')

# URL patterns
urlpatterns = [
    # API root
    path('', views.api_root, name='api-root'),
    
    # JWT Token endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
    # Payment processing
    path('payments/process/', views.ProcessPaymentView.as_view(), name='process-payment'),
    
    # Admin dashboard
    path('admin/dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
    
    # Router URLs (CRUD operations for all models)
    path('', include(router.urls)),
]
