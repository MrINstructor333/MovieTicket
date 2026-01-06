"""
Management command to seed the database with sample data.

Run with: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, time, timedelta
from decimal import Decimal
from api.models import User, Movie, Theater, Seat, Show


class Command(BaseCommand):
    help = 'Seed the database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')
        
        # Create admin user
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@movieticket.com',
                'role': 'admin',
                'first_name': 'System',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('✓ Admin user created (username: admin, password: admin123)'))
        
        # Create sample customer
        customer, created = User.objects.get_or_create(
            username='customer1',
            defaults={
                'email': 'customer@example.com',
                'role': 'customer',
                'first_name': 'John',
                'last_name': 'Doe',
                'phone': '+255123456789',
            }
        )
        if created:
            customer.set_password('customer123')
            customer.save()
            self.stdout.write(self.style.SUCCESS('✓ Sample customer created (username: customer1, password: customer123)'))
        
        # Create sample movies
        movies_data = [
            {
                'title': 'The Dark Knight',
                'genre': 'action',
                'duration': 152,
                'language': 'English',
                'release_date': date(2024, 1, 15),
                'description': 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                'rating': 'PG-13',
            },
            {
                'title': 'Inception',
                'genre': 'sci-fi',
                'duration': 148,
                'language': 'English',
                'release_date': date(2024, 2, 20),
                'description': 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
                'rating': 'PG-13',
            },
            {
                'title': 'The Hangover',
                'genre': 'comedy',
                'duration': 100,
                'language': 'English',
                'release_date': date(2024, 3, 10),
                'description': 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.',
                'rating': 'R',
            },
            {
                'title': 'Titanic',
                'genre': 'romance',
                'duration': 195,
                'language': 'English',
                'release_date': date(2024, 4, 5),
                'description': 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
                'rating': 'PG-13',
            },
            {
                'title': 'The Conjuring',
                'genre': 'horror',
                'duration': 112,
                'language': 'English',
                'release_date': date(2024, 5, 1),
                'description': 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
                'rating': 'R',
            },
            {
                'title': 'Interstellar',
                'genre': 'sci-fi',
                'duration': 169,
                'language': 'English',
                'release_date': date(2024, 6, 15),
                'description': 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                'rating': 'PG-13',
            },
        ]
        
        movies = []
        for movie_data in movies_data:
            movie, created = Movie.objects.get_or_create(
                title=movie_data['title'],
                defaults=movie_data
            )
            movies.append(movie)
            if created:
                self.stdout.write(f'✓ Movie created: {movie.title}')
        
        # Create theaters
        theaters_data = [
            {
                'name': 'Screen 1 - IMAX',
                'location': 'Mlimani City, Dar es Salaam',
                'total_seats': 100,
                'description': 'Premium IMAX experience with Dolby Atmos sound',
            },
            {
                'name': 'Screen 2 - Standard',
                'location': 'Mlimani City, Dar es Salaam',
                'total_seats': 80,
                'description': 'Standard cinema hall with comfortable seating',
            },
            {
                'name': 'Screen 3 - VIP',
                'location': 'Slipway, Dar es Salaam',
                'total_seats': 50,
                'description': 'VIP experience with recliner seats and in-seat service',
            },
        ]
        
        theaters = []
        for theater_data in theaters_data:
            theater, created = Theater.objects.get_or_create(
                name=theater_data['name'],
                defaults=theater_data
            )
            theaters.append(theater)
            if created:
                self.stdout.write(f'✓ Theater created: {theater.name}')
                
                # Generate seats for new theater
                self._generate_seats(theater)
        
        # Create shows for the next 7 days
        # Each theater shows different movies at different times
        today = timezone.now().date()
        show_times = [time(10, 0), time(14, 0), time(18, 0), time(21, 0)]
        
        shows_created = 0
        for day_offset in range(7):
            show_date = today + timedelta(days=day_offset)
            
            # Distribute movies across theaters and time slots
            for theater_idx, theater in enumerate(theaters):
                # Each theater shows 2 movies per day at different times
                theater_movies = movies[theater_idx*2:(theater_idx+1)*2] if theater_idx < 2 else movies[-2:]
                
                for movie_idx, movie in enumerate(theater_movies):
                    # Assign different time slots to different movies
                    movie_times = show_times[movie_idx*2:(movie_idx+1)*2]
                    
                    for show_time in movie_times:
                        base_price = Decimal('15000.00')  # TZS 15,000
                        
                        # Premium pricing for IMAX and VIP
                        if 'IMAX' in theater.name:
                            base_price = Decimal('25000.00')
                        elif 'VIP' in theater.name:
                            base_price = Decimal('35000.00')
                        
                        # Weekend pricing
                        if show_date.weekday() >= 5:  # Saturday or Sunday
                            base_price *= Decimal('1.2')
                        
                        show, created = Show.objects.get_or_create(
                            theater=theater,
                            show_date=show_date,
                            show_time=show_time,
                            defaults={
                                'movie': movie,
                                'base_price': base_price,
                                'is_active': True,
                            }
                        )
                        if created:
                            shows_created += 1
        
        self.stdout.write(f'✓ Shows created: {shows_created}')
        
        self.stdout.write(self.style.SUCCESS('\n✓ Database seeding completed successfully!'))
        self.stdout.write('\nSample credentials:')
        self.stdout.write('  Admin: username=admin, password=admin123')
        self.stdout.write('  Customer: username=customer1, password=customer123')
    
    def _generate_seats(self, theater):
        """Generate seats for a theater"""
        row_labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        
        # Determine rows and seats based on total_seats
        if theater.total_seats <= 50:
            rows = 5
            seats_per_row = 10
        elif theater.total_seats <= 80:
            rows = 8
            seats_per_row = 10
        else:
            rows = 10
            seats_per_row = 10
        
        seats_created = 0
        for i in range(rows):
            row_label = row_labels[i]
            for j in range(1, seats_per_row + 1):
                seat_number = f"{row_label}{j}"
                
                # Determine seat type based on row
                if i < 2:
                    seat_type = 'vip'
                    price_multiplier = Decimal('1.50')
                elif i < 4:
                    seat_type = 'premium'
                    price_multiplier = Decimal('1.25')
                else:
                    seat_type = 'regular'
                    price_multiplier = Decimal('1.00')
                
                Seat.objects.create(
                    theater=theater,
                    seat_number=seat_number,
                    row=row_label,
                    seat_type=seat_type,
                    price_multiplier=price_multiplier,
                    is_active=True
                )
                seats_created += 1
        
        # Update theater's total seats
        theater.total_seats = seats_created
        theater.save()
        
        self.stdout.write(f'  ✓ {seats_created} seats generated for {theater.name}')
