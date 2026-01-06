# Movie Ticket Booking System - Backend

## DAR ES SALAAM INSTITUTE OF TECHNOLOGY
**MODULE CODE:** COU 07503  
**MODULE NAME:** WEB APPLICATION DEVELOPMENT

### Team Members
| Name | Registration Number |
|------|---------------------|
| ANGEL FRIGIL KANJE | 230242487064 |
| MZALIWA KIBURUTA EDWARD | 230242435865 |
| DANIEL MAREGESI THOMAS | 2102302229655 |

---

## Project Overview

A web-based Movie Ticket Booking System that allows users to:
- View available movies and showtimes
- Select seats and book tickets
- Make payments online
- View booking history

Administrators can:
- Manage movies, theaters, and shows
- View all bookings and payments
- Generate reports

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Django 6.0 |
| API | Django REST Framework |
| Database | PostgreSQL |
| Authentication | Django Session Auth |

---

## Project Structure

```
MovieTicket/
├── api/                          # Main API application
│   ├── migrations/               # Database migrations
│   ├── admin.py                  # Django admin configuration
│   ├── models.py                 # Database models
│   ├── serializers.py            # API serializers
│   ├── views.py                  # API views/endpoints
│   └── urls.py                   # API URL routing
├── movie_ticket_system/          # Django project settings
│   ├── settings.py               # Project configuration
│   ├── urls.py                   # Main URL routing
│   └── wsgi.py                   # WSGI configuration
├── media/                        # Uploaded files (movie posters)
├── venv/                         # Python virtual environment
├── manage.py                     # Django management script
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

---

## Database Schema (Entities)

1. **User** - Customers and Admins
2. **Movie** - Movie information
3. **Theater** - Cinema screens/halls
4. **Seat** - Individual seats in theaters
5. **Show** - Movie showtimes
6. **Booking** - Ticket bookings
7. **BookingSeat** - Junction table (Booking-Seat)
8. **Payment** - Payment records

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- PostgreSQL 12+
- pip (Python package manager)

### Step 1: Clone/Navigate to Project
```bash
cd /home/mzaliwa/Desktop/MovieTicket
```

### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Linux/Mac
# OR
venv\Scripts\activate  # On Windows
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure PostgreSQL Database

1. Create a PostgreSQL database:
```sql
CREATE DATABASE movie_ticket_db;
```

2. Update database settings in `movie_ticket_system/settings.py` or set environment variables:
```bash
export DB_NAME=movie_ticket_db
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_HOST=localhost
export DB_PORT=5432
```

### Step 5: Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 6: Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

### Step 7: Run Development Server
```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000/api/`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | User registration |
| POST | `/api/auth/login/` | User login |
| POST | `/api/auth/logout/` | User logout |
| GET/PUT | `/api/auth/profile/` | View/Update profile |
| POST | `/api/auth/change-password/` | Change password |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies/` | List all movies |
| GET | `/api/movies/{id}/` | Get movie details |
| POST | `/api/movies/` | Create movie (Admin) |
| PUT | `/api/movies/{id}/` | Update movie (Admin) |
| DELETE | `/api/movies/{id}/` | Delete movie (Admin) |
| GET | `/api/movies/{id}/shows/` | Get movie shows |

### Theaters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/theaters/` | List all theaters |
| GET | `/api/theaters/{id}/` | Get theater details |
| POST | `/api/theaters/` | Create theater (Admin) |
| PUT | `/api/theaters/{id}/` | Update theater (Admin) |
| POST | `/api/theaters/{id}/generate_seats/` | Generate seats (Admin) |

### Shows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shows/` | List all shows |
| GET | `/api/shows/{id}/` | Get show details with seats |
| POST | `/api/shows/` | Create show (Admin) |
| GET | `/api/shows/{id}/seats/` | Get seat availability |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/` | List user bookings |
| GET | `/api/bookings/{id}/` | Get booking details |
| POST | `/api/bookings/` | Create new booking |
| POST | `/api/bookings/{id}/cancel/` | Cancel booking |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments/` | List payments |
| POST | `/api/payments/process/` | Process payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/` | Admin statistics |
| GET | `/api/admin/users/` | Manage users |

---

## Sample API Usage

### Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Create a Booking
```bash
curl -X POST http://localhost:8000/api/bookings/ \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionid=your_session_id" \
  -d '{
    "show_id": 1,
    "seat_ids": [1, 2, 3]
  }'
```

---

## Admin Panel

Access the Django admin panel at: `http://localhost:8000/admin/`

Use your superuser credentials to log in.

---

## Development Notes

- The system uses Django's session-based authentication
- CORS is configured for React frontend on `localhost:3000`
- Media files (movie posters) are stored in the `media/` directory
- All API responses are in JSON format

---

## License

This project is developed for educational purposes as part of the DIT Web Application Development course.

---

© 2026 DAR ES SALAAM INSTITUTE OF TECHNOLOGY
