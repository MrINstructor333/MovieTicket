# 🎬 Movie Ticket Booking System

A full-stack web application for booking movie tickets online, built with Django REST Framework (Backend) and React + Vite (Frontend).

---

## 📚 DAR ES SALAAM INSTITUTE OF TECHNOLOGY

| | |
|---|---|
| **Module Code** | COU 07503 |
| **Module Name** | Web Application Development |

### 👥 Team Members

| Name | Registration Number |
|------|---------------------|
| ANGEL FRIGIL KANJE | 230242487064 |
| MZALIWA KIBURUTA EDWARD | 230242435865 |
| DANIEL MAREGESI THOMAS | 2102302229655 |

---

## 📖 Project Overview

The Movie Ticket Booking System is a comprehensive web application that provides an intuitive platform for users to browse movies, select showtimes, choose seats, and complete bookings with online payments.

### 🎯 Key Features

#### For Customers
- 🎥 Browse movies (Now Showing & Coming Soon)
- 🔍 Search and filter movies by genre, language, and rating
- 🎫 View movie details and available showtimes
- 💺 Interactive seat selection with real-time availability
- 💳 Secure online payment processing
- 📋 View and manage booking history
- 👤 User profile management

#### For Administrators
- 📊 Dashboard with analytics and statistics
- 🎬 Full CRUD operations for movies
- 🏛️ Theater and seat management
- 📅 Show/Showtime scheduling
- 👥 User management
- 📑 Booking and payment oversight
- 📈 Analytics and reporting

---

## 🛠️ Technology Stack

### Backend
| Component | Technology |
|-----------|------------|
| Framework | Django 5.0+ |
| API | Django REST Framework |
| Database | PostgreSQL |
| Authentication | JWT (Simple JWT) |
| CORS | django-cors-headers |
| Image Processing | Pillow |

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Animations | Framer Motion |
| UI Components | Headless UI |
| Icons | Lucide React |
| Date Handling | date-fns |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
MovieTicket/
├── api/                              # Django REST API Application
│   ├── migrations/                   # Database migrations
│   ├── management/                   # Custom management commands
│   │   └── commands/
│   │       └── seed_data.py          # Database seeding script
│   ├── admin.py                      # Django admin configuration
│   ├── models.py                     # Database models (8 entities)
│   ├── serializers.py                # API serializers
│   ├── views.py                      # API views/endpoints
│   └── urls.py                       # API URL routing
│
├── movie_ticket_system/              # Django Project Settings
│   ├── settings.py                   # Project configuration
│   ├── urls.py                       # Main URL routing
│   ├── wsgi.py                       # WSGI configuration
│   └── asgi.py                       # ASGI configuration
│
├── frontend/                         # React Frontend Application
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── api/                      # API services
│   │   │   ├── axios.js              # Axios configuration
│   │   │   └── services.js           # API service functions
│   │   ├── components/               # Reusable components
│   │   │   ├── booking/              # Booking-related components
│   │   │   │   ├── BookingSummary.jsx
│   │   │   │   ├── SeatLegend.jsx
│   │   │   │   └── SeatMap.jsx
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── movies/               # Movie display components
│   │   │   │   ├── MovieCard.jsx
│   │   │   │   └── MovieGrid.jsx
│   │   │   └── ui/                   # UI primitives
│   │   │       ├── BentoGrid.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── GlassCard.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Loader.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── ...
│   │   ├── context/                  # React Context providers
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   └── BookingContext.jsx    # Booking flow state
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Movies.jsx
│   │   │   ├── MovieDetail.jsx
│   │   │   ├── SeatSelection.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/                # Admin pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Movies.jsx
│   │   │       ├── MovieForm.jsx
│   │   │       ├── Shows.jsx
│   │   │       ├── ShowForm.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── Bookings.jsx
│   │   │       ├── Payments.jsx
│   │   │       ├── Analytics.jsx
│   │   │       └── Settings.jsx
│   │   ├── App.jsx                   # Main App component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   └── tailwind.config.js            # Tailwind CSS configuration
│
├── manage.py                         # Django management script
├── requirements.txt                  # Python dependencies
└── README.md                         # This file
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Movie    │       │   Theater   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ username    │       │ title       │       │ name        │
│ email       │       │ genre       │       │ location    │
│ password    │       │ duration    │       │ total_seats │
│ role        │       │ language    │       │ description │
│ phone       │       │ release_date│       │ is_active   │
│ created_at  │       │ description │       └──────┬──────┘
│ updated_at  │       │ poster      │              │
└──────┬──────┘       │ poster_url  │              │
       │              │ rating      │              │
       │              │ is_active   │              │
       │              └──────┬──────┘              │
       │                     │                     │
       │                     │                     │
       │              ┌──────┴──────┐              │
       │              │    Show     │──────────────┘
       │              ├─────────────┤
       │              │ id          │
       │              │ movie_id    │◄───────┐
       │              │ theater_id  │        │
       │              │ show_date   │        │
       │              │ show_time   │        │
       │              │ price       │        │
       │              │ is_active   │        │
       │              └──────┬──────┘        │
       │                     │               │
       │              ┌──────┴──────┐        │
       │              │   Booking   │        │
       │              ├─────────────┤        │
       └─────────────►│ id          │        │
                      │ user_id     │        │
                      │ show_id     │◄───────┘
                      │ booking_date│
                      │ total_amount│
                      │ status      │
                      └──────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────┴──────┐┌──────┴──────┐┌──────┴──────┐
       │ BookingSeat ││   Payment   ││    Seat     │
       ├─────────────┤├─────────────┤├─────────────┤
       │ id          ││ id          ││ id          │
       │ booking_id  ││ booking_id  ││ theater_id  │
       │ seat_id     ││ amount      ││ row         │
       │ price       ││ method      ││ number      │
       └─────────────┘│ status      ││ seat_type   │
                      │ timestamp   ││ is_active   │
                      └─────────────┘└─────────────┘
```

### Models Description

| Model | Description |
|-------|-------------|
| **User** | Custom user model with roles (Admin/Customer) |
| **Movie** | Movie details including genre, rating, poster |
| **Theater** | Cinema halls/screens information |
| **Seat** | Individual seats in theaters with types (Standard/Premium/VIP) |
| **Show** | Movie showtimes linking movies to theaters |
| **Booking** | Customer ticket bookings |
| **BookingSeat** | Junction table for booking-seat relationship |
| **Payment** | Payment transaction records |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | User registration |
| POST | `/api/auth/login/` | User login (returns JWT) |
| POST | `/api/auth/logout/` | User logout |
| GET | `/api/auth/profile/` | Get user profile |
| PUT | `/api/auth/profile/` | Update user profile |
| POST | `/api/auth/change-password/` | Change password |
| POST | `/api/auth/token/` | Obtain JWT token pair |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/token/verify/` | Verify token |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies/` | List all movies |
| GET | `/api/movies/{id}/` | Get movie details |
| POST | `/api/movies/` | Create movie (Admin) |
| PUT | `/api/movies/{id}/` | Update movie (Admin) |
| DELETE | `/api/movies/{id}/` | Delete movie (Admin) |

### Theaters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/theaters/` | List all theaters |
| GET | `/api/theaters/{id}/` | Get theater details |
| POST | `/api/theaters/` | Create theater (Admin) |
| PUT | `/api/theaters/{id}/` | Update theater (Admin) |
| DELETE | `/api/theaters/{id}/` | Delete theater (Admin) |

### Shows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shows/` | List all shows |
| GET | `/api/shows/{id}/` | Get show details |
| POST | `/api/shows/` | Create show (Admin) |
| PUT | `/api/shows/{id}/` | Update show (Admin) |
| DELETE | `/api/shows/{id}/` | Delete show (Admin) |

### Seats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seats/` | List all seats |
| GET | `/api/seats/{id}/` | Get seat details |
| GET | `/api/shows/{id}/seats/` | Get seat availability |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/` | List user's bookings |
| GET | `/api/bookings/{id}/` | Get booking details |
| POST | `/api/bookings/` | Create booking |
| DELETE | `/api/bookings/{id}/` | Cancel booking |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments/` | List payments |
| POST | `/api/payments/process/` | Process payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/` | Dashboard statistics |
| GET | `/api/admin/users/` | User management |

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

#### Step 1: Clone/Navigate to Project
```bash
cd MovieTicket
```

#### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Linux/Mac
# OR
venv\Scripts\activate     # On Windows
```

#### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Configure PostgreSQL Database

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

#### Step 5: Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Step 6: Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

#### Step 7: Seed Sample Data (Optional)
```bash
python manage.py seed_data
```

#### Step 8: Run Backend Server
```bash
python manage.py runserver
```

The API will be available at: **http://localhost:8000/api/**

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 2: Install Node Dependencies
```bash
npm install
```

#### Step 3: Run Development Server
```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173/**

---

## 🖥️ Frontend Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with featured movies |
| `/movies` | Movies | Browse all movies |
| `/movies/:id` | MovieDetail | Movie details and showtimes |
| `/booking/:showId` | SeatSelection | Interactive seat selection |
| `/payment/:bookingId` | Payment | Payment processing |
| `/booking-confirmation/:bookingId` | BookingConfirmation | Booking success page |
| `/bookings` | MyBookings | User's booking history |
| `/profile` | Profile | User profile management |
| `/login` | Login | User login |
| `/register` | Register | User registration |

### Admin Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | AdminDashboard | Admin dashboard with stats |
| `/admin/movies` | AdminMovies | Movie management |
| `/admin/movies/new` | MovieForm | Add new movie |
| `/admin/movies/edit/:id` | MovieForm | Edit movie |
| `/admin/shows` | AdminShows | Show/Showtime management |
| `/admin/shows/new` | ShowForm | Add new show |
| `/admin/shows/edit/:id` | ShowForm | Edit show |
| `/admin/users` | AdminUsers | User management |
| `/admin/bookings` | AdminBookings | Booking management |
| `/admin/payments` | AdminPayments | Payment records |
| `/admin/analytics` | AdminAnalytics | Analytics dashboard |
| `/admin/settings` | AdminSettings | System settings |

---

## 🎨 Screenshots

### User Interface

```
┌────────────────────────────────────────────────────────────┐
│  🎬 MovieTicket    Movies    My Bookings    [Login]        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│     │ 🎬      │  │ 🎬      │  │ 🎬      │  │ 🎬      │    │
│     │ Movie 1 │  │ Movie 2 │  │ Movie 3 │  │ Movie 4 │    │
│     │ Action  │  │ Comedy  │  │ Drama   │  │ Sci-Fi  │    │
│     │ ⭐ PG-13│  │ ⭐ PG   │  │ ⭐ R    │  │ ⭐ PG-13│    │
│     └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│                                                            │
│                    [Now Showing] [Coming Soon]             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Seat Selection

```
┌────────────────────────────────────────┐
│              🎬 SCREEN 🎬              │
├────────────────────────────────────────┤
│                                        │
│    A  [1][2][3][4]    [5][6][7][8]    │
│    B  [1][2][■][■]    [5][6][7][8]    │
│    C  [1][2][3][4]    [5][6][7][8]    │
│    D  [1][2][3][4]    [5][6][7][8]    │
│    E  [■][■][3][4]    [5][6][7][8]    │
│                                        │
│    Legend:                             │
│    [ ] Available  [■] Booked  [✓] Selected │
│                                        │
│    Selected: B3, B4  Total: $25.00     │
│              [Continue to Payment]      │
└────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Register  │────►│    Login    │────►│  Dashboard  │
│   /register │     │   /login    │     │      /      │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  JWT Token  │
                    │   Stored    │
                    │ localStorage│
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │   Customer  │          │    Admin    │
       │   Routes    │          │   Routes    │
       └─────────────┘          └─────────────┘
```

---

## 📦 Dependencies

### Backend (Python)
```
Django>=5.0,<7.0
djangorestframework>=3.14.0
djangorestframework-simplejwt>=5.3.0
django-cors-headers>=4.0.0
psycopg2-binary>=2.9.0
Pillow>=10.0.0
```

### Frontend (Node.js)
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.11.0",
  "axios": "^1.13.2",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^12.24.0",
  "@headlessui/react": "^2.2.9",
  "lucide-react": "^0.562.0",
  "date-fns": "^4.1.0",
  "react-hot-toast": "^2.6.0"
}
```

---

## ⚙️ Configuration

### Backend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `DJANGO_SECRET_KEY` | Django secret key | Auto-generated |
| `DEBUG` | Debug mode | `True` |
| `DB_NAME` | Database name | `movie_ticket_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |

### Frontend Environment Variables
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🧪 Sample API Usage

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

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

### Get Movies
```bash
curl -X GET http://localhost:8000/api/movies/ \
  -H "Content-Type: application/json"
```

### Create a Booking
```bash
curl -X POST http://localhost:8000/api/bookings/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "show": 1,
    "seats": [1, 2, 3]
  }'
```

---

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Django's PBKDF2 password hashing
- **CORS Protection**: Configured for specific origins
- **CSRF Protection**: Built-in Django CSRF middleware
- **Role-Based Access**: Admin and Customer role separation
- **Input Validation**: Serializer-level validation

---

## 📱 Responsive Design

The frontend is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

---

## 🚀 Deployment

### Backend (Django)
1. Set `DEBUG = False` in production
2. Configure `ALLOWED_HOSTS`
3. Set up a production database
4. Use a production WSGI server (Gunicorn)
5. Serve static files with Nginx or WhiteNoise

### Frontend (React)
```bash
cd frontend
npm run build
```
The built files will be in `frontend/dist/` ready for deployment.

---

## 📄 License

This project is developed for **educational purposes** as part of the DIT Web Application Development course (COU 07503).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact

For any questions or issues, please contact the team members listed above.

---

<div align="center">

**© 2026 DAR ES SALAAM INSTITUTE OF TECHNOLOGY**

Made with ❤️ by Team COU 07503

</div>
