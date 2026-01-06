"""
URL configuration for movie_ticket_system project.

Movie Ticket Booking System
DAR ES SALAAM INSTITUTE OF TECHNOLOGY
MODULE CODE: COU 07503
MODULE NAME: WEB APPLICATION DEVELOPMENT
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django Admin Panel
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('api.urls')),
    
    # DRF browsable API authentication
    path('api-auth/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
