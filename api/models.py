"""
Movie Ticket Booking System - Database Models

DAR ES SALAAM INSTITUTE OF TECHNOLOGY
MODULE CODE: COU 07503
MODULE NAME: WEB APPLICATION DEVELOPMENT

Team Members:
- ANGEL FRIGIL KANJE (230242487064)
- MZALIWA KIBURUTA EDWARD (230242435865)
- DANIEL MAREGESI THOMAS (2102302229655)

This module defines all database entities for the Movie Ticket Booking System:
- User: Customer and Admin users
- Movie: Movie information
- Theater: Cinema theater details
- Show: Movie showtime scheduling
- Seat: Theater seat management
- Booking: Ticket booking records
- Payment: Payment transactions
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from decimal import Decimal


class User(AbstractUser):
    """
    Custom User Model
    Extends Django's AbstractUser to support both Admin and Customer roles.
    
    Attributes:
        role: User role (Admin or Customer)
        phone: Optional phone number
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('customer', 'Customer'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_customer(self):
        return self.role == 'customer'


class Movie(models.Model):
    """
    Movie Model
    Stores information about movies available for booking.
    
    Attributes:
        title: Movie title
        genre: Movie genre (Action, Comedy, Drama, etc.)
        duration: Duration in minutes
        language: Movie language
        release_date: Release date
        description: Movie description/synopsis
        poster: Movie poster image
        rating: Movie rating (PG, PG-13, R, etc.)
        is_active: Whether movie is currently showing
    """
    
    GENRE_CHOICES = [
        ('action', 'Action'),
        ('comedy', 'Comedy'),
        ('drama', 'Drama'),
        ('horror', 'Horror'),
        ('romance', 'Romance'),
        ('sci-fi', 'Science Fiction'),
        ('thriller', 'Thriller'),
        ('animation', 'Animation'),
        ('documentary', 'Documentary'),
        ('adventure', 'Adventure'),
    ]
    
    RATING_CHOICES = [
        ('G', 'G - General Audiences'),
        ('PG', 'PG - Parental Guidance'),
        ('PG-13', 'PG-13 - Parents Strongly Cautioned'),
        ('R', 'R - Restricted'),
        ('NC-17', 'NC-17 - Adults Only'),
    ]
    
    title = models.CharField(max_length=200)
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    language = models.CharField(max_length=50)
    release_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    poster = models.ImageField(upload_to='movie_posters/', blank=True, null=True)
    poster_url = models.URLField(max_length=500, blank=True, null=True, help_text="External poster URL")
    rating = models.CharField(max_length=10, choices=RATING_CHOICES, default='PG')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'movies'
        verbose_name = 'Movie'
        verbose_name_plural = 'Movies'
        ordering = ['-release_date']
    
    def __str__(self):
        return f"{self.title} ({self.release_date.year})"


class Theater(models.Model):
    """
    Theater Model
    Represents cinema theaters/screens where movies are shown.
    
    Attributes:
        name: Theater name (e.g., "Screen 1", "IMAX Hall")
        location: Physical location/address
        total_seats: Total number of seats
        is_active: Whether theater is currently operational
    """
    
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    total_seats = models.PositiveIntegerField(default=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'theaters'
        verbose_name = 'Theater'
        verbose_name_plural = 'Theaters'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.location}"


class Seat(models.Model):
    """
    Seat Model
    Represents individual seats in a theater.
    
    Attributes:
        theater: Foreign key to Theater
        seat_number: Seat identifier (e.g., "A1", "B5")
        seat_type: Type of seat (Regular, Premium, VIP)
        price_multiplier: Price multiplier based on seat type
        is_active: Whether seat is available for booking
    """
    
    SEAT_TYPE_CHOICES = [
        ('regular', 'Regular'),
        ('premium', 'Premium'),
        ('vip', 'VIP'),
    ]
    
    theater = models.ForeignKey(
        Theater, 
        on_delete=models.CASCADE, 
        related_name='seats'
    )
    seat_number = models.CharField(max_length=10)
    row = models.CharField(max_length=5)
    seat_type = models.CharField(max_length=10, choices=SEAT_TYPE_CHOICES, default='regular')
    price_multiplier = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=Decimal('1.00'),
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'seats'
        verbose_name = 'Seat'
        verbose_name_plural = 'Seats'
        unique_together = ['theater', 'seat_number']
        ordering = ['row', 'seat_number']
    
    def __str__(self):
        return f"{self.theater.name} - Seat {self.seat_number} ({self.seat_type})"


class Show(models.Model):
    """
    Show Model
    Represents a movie showtime in a specific theater.
    
    Attributes:
        movie: Foreign key to Movie
        theater: Foreign key to Theater
        show_date: Date of the show
        show_time: Time of the show
        base_price: Base ticket price for this show
        is_active: Whether show is active and can be booked
    """
    
    movie = models.ForeignKey(
        Movie, 
        on_delete=models.CASCADE, 
        related_name='shows'
    )
    theater = models.ForeignKey(
        Theater, 
        on_delete=models.CASCADE, 
        related_name='shows'
    )
    show_date = models.DateField()
    show_time = models.TimeField()
    base_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'shows'
        verbose_name = 'Show'
        verbose_name_plural = 'Shows'
        ordering = ['show_date', 'show_time']
        unique_together = ['theater', 'show_date', 'show_time']
    
    def __str__(self):
        return f"{self.movie.title} - {self.theater.name} ({self.show_date} {self.show_time})"
    
    def get_available_seats(self):
        """Returns queryset of available seats for this show"""
        booked_seat_ids = BookingSeat.objects.filter(
            booking__show=self,
            booking__status__in=['confirmed', 'pending']
        ).values_list('seat_id', flat=True)
        
        return self.theater.seats.filter(is_active=True).exclude(id__in=booked_seat_ids)
    
    def get_booked_seats(self):
        """Returns queryset of booked seats for this show"""
        booked_seat_ids = BookingSeat.objects.filter(
            booking__show=self,
            booking__status__in=['confirmed', 'pending']
        ).values_list('seat_id', flat=True)
        
        return self.theater.seats.filter(id__in=booked_seat_ids)


class Booking(models.Model):
    """
    Booking Model
    Represents a ticket booking made by a user.
    
    Attributes:
        user: Foreign key to User
        show: Foreign key to Show
        booking_date: When the booking was made
        total_amount: Total price of the booking
        status: Booking status (Pending, Confirmed, Cancelled)
        booking_reference: Unique booking reference code
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='bookings'
    )
    show = models.ForeignKey(
        Show, 
        on_delete=models.CASCADE, 
        related_name='bookings'
    )
    booking_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    booking_reference = models.CharField(max_length=20, unique=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
        ordering = ['-booking_date']
    
    def __str__(self):
        return f"Booking {self.booking_reference} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        if not self.booking_reference:
            import uuid
            self.booking_reference = f"BK{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def calculate_total(self):
        """Calculate total amount from booked seats"""
        total = sum(
            self.show.base_price * bs.seat.price_multiplier 
            for bs in self.booking_seats.all()
        )
        return total


class BookingSeat(models.Model):
    """
    BookingSeat Model (Junction Table)
    Links bookings to seats (Many-to-Many relationship).
    
    Attributes:
        booking: Foreign key to Booking
        seat: Foreign key to Seat
        price: Price paid for this specific seat
    """
    
    booking = models.ForeignKey(
        Booking, 
        on_delete=models.CASCADE, 
        related_name='booking_seats'
    )
    seat = models.ForeignKey(
        Seat, 
        on_delete=models.CASCADE, 
        related_name='booking_seats'
    )
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    
    class Meta:
        db_table = 'booking_seats'
        verbose_name = 'Booking Seat'
        verbose_name_plural = 'Booking Seats'
        unique_together = ['booking', 'seat']
    
    def __str__(self):
        return f"{self.booking.booking_reference} - {self.seat.seat_number}"


class Payment(models.Model):
    """
    Payment Model
    Stores payment information for bookings.
    
    Attributes:
        booking: One-to-One relationship with Booking
        payment_method: Method of payment (Cash, Card, Mobile)
        payment_status: Status of payment (Pending, Completed, Failed, Refunded)
        transaction_id: External transaction reference
        amount: Payment amount
        payment_date: When payment was processed
    """
    
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('mobile_money', 'Mobile Money'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    booking = models.OneToOneField(
        Booking, 
        on_delete=models.CASCADE, 
        related_name='payment'
    )
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(
        max_length=15, 
        choices=PAYMENT_STATUS_CHOICES, 
        default='pending'
    )
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    payment_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.id} - {self.booking.booking_reference} ({self.payment_status})"
    
    def save(self, *args, **kwargs):
        if self.payment_status == 'completed' and not self.payment_date:
            from django.utils import timezone
            self.payment_date = timezone.now()
            # Update booking status when payment is completed
            self.booking.status = 'confirmed'
            self.booking.save()
        super().save(*args, **kwargs)
