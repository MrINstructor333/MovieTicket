"""
Movie Ticket Booking System - Django Admin Configuration

This module configures the Django admin panel for managing all entities.
Provides a user-friendly interface for administrators to manage the system.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Movie, Theater, Seat, Show, Booking, BookingSeat, Payment


# ==================== USER ADMIN ====================

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model"""
    
    list_display = ('username', 'email', 'role', 'first_name', 'last_name', 
                    'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone'),
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone', 'email'),
        }),
    )


# ==================== MOVIE ADMIN ====================

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    """Admin configuration for Movie model"""
    
    list_display = ('title', 'genre', 'duration_display', 'language', 
                    'release_date', 'rating', 'is_active', 'poster_preview')
    list_filter = ('genre', 'rating', 'language', 'is_active', 'release_date')
    search_fields = ('title', 'description')
    ordering = ('-release_date',)
    date_hierarchy = 'release_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'genre', 'language', 'rating')
        }),
        ('Details', {
            'fields': ('duration', 'release_date', 'description')
        }),
        ('Media', {
            'fields': ('poster',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    
    def duration_display(self, obj):
        hours = obj.duration // 60
        minutes = obj.duration % 60
        return f"{hours}h {minutes}m" if hours else f"{minutes}m"
    duration_display.short_description = 'Duration'
    
    def poster_preview(self, obj):
        if obj.poster:
            return format_html(
                '<img src="{}" width="50" height="75" style="object-fit: cover;" />',
                obj.poster.url
            )
        return "No poster"
    poster_preview.short_description = 'Poster'


# ==================== THEATER ADMIN ====================

@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    """Admin configuration for Theater model"""
    
    list_display = ('name', 'location', 'total_seats', 'seats_count', 'is_active')
    list_filter = ('is_active', 'location')
    search_fields = ('name', 'location')
    ordering = ('name',)
    
    def seats_count(self, obj):
        return obj.seats.filter(is_active=True).count()
    seats_count.short_description = 'Active Seats'


# ==================== SEAT ADMIN ====================

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    """Admin configuration for Seat model"""
    
    list_display = ('seat_number', 'theater', 'row', 'seat_type', 
                    'price_multiplier', 'is_active')
    list_filter = ('theater', 'seat_type', 'row', 'is_active')
    search_fields = ('seat_number', 'theater__name')
    ordering = ('theater', 'row', 'seat_number')
    
    autocomplete_fields = ['theater']


# ==================== SHOW ADMIN ====================

@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    """Admin configuration for Show model"""
    
    list_display = ('movie', 'theater', 'show_date', 'show_time', 
                    'base_price', 'available_seats', 'is_active')
    list_filter = ('theater', 'show_date', 'is_active', 'movie')
    search_fields = ('movie__title', 'theater__name')
    ordering = ('show_date', 'show_time')
    date_hierarchy = 'show_date'
    
    autocomplete_fields = ['movie', 'theater']
    
    def available_seats(self, obj):
        total = obj.theater.seats.filter(is_active=True).count()
        booked = obj.get_booked_seats().count()
        return f"{total - booked}/{total}"
    available_seats.short_description = 'Available/Total'


# ==================== BOOKING ADMIN ====================

class BookingSeatInline(admin.TabularInline):
    """Inline admin for BookingSeat"""
    
    model = BookingSeat
    extra = 0
    readonly_fields = ('seat', 'price')
    can_delete = False


class PaymentInline(admin.StackedInline):
    """Inline admin for Payment"""
    
    model = Payment
    extra = 0
    readonly_fields = ('amount', 'payment_date', 'created_at')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Admin configuration for Booking model"""
    
    list_display = ('booking_reference', 'user', 'movie_title', 'theater_name',
                    'show_date', 'total_amount', 'status', 'booking_date')
    list_filter = ('status', 'booking_date', 'show__theater', 'show__movie')
    search_fields = ('booking_reference', 'user__username', 'user__email',
                     'show__movie__title')
    ordering = ('-booking_date',)
    date_hierarchy = 'booking_date'
    readonly_fields = ('booking_reference', 'total_amount', 'booking_date')
    
    inlines = [BookingSeatInline, PaymentInline]
    
    def movie_title(self, obj):
        return obj.show.movie.title
    movie_title.short_description = 'Movie'
    
    def theater_name(self, obj):
        return obj.show.theater.name
    theater_name.short_description = 'Theater'
    
    def show_date(self, obj):
        return f"{obj.show.show_date} {obj.show.show_time}"
    show_date.short_description = 'Show Date/Time'


# ==================== PAYMENT ADMIN ====================

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin configuration for Payment model"""
    
    list_display = ('id', 'booking_reference', 'payment_method', 'amount',
                    'payment_status', 'payment_date', 'created_at')
    list_filter = ('payment_status', 'payment_method', 'payment_date')
    search_fields = ('booking__booking_reference', 'transaction_id')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    readonly_fields = ('amount', 'created_at', 'updated_at')
    
    def booking_reference(self, obj):
        return obj.booking.booking_reference
    booking_reference.short_description = 'Booking Ref'


# ==================== ADMIN SITE CUSTOMIZATION ====================

admin.site.site_header = "Movie Ticket Booking System Admin"
admin.site.site_title = "Movie Ticket Admin"
admin.site.index_title = "Welcome to Movie Ticket Booking System Administration"
