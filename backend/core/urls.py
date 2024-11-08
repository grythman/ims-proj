"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from apps.notifications.views import NotificationViewSet
from apps.users.views import UserViewSet
from apps.companies.views import CompanyViewSet
from apps.internships.views import InternshipViewSet
from .views import dashboard_stats, api_root

# Initialize the router
router = DefaultRouter()

# Register viewsets
router.register(r'users', UserViewSet, basename='user')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'internships', InternshipViewSet, basename='internship')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('admin/', admin.site.urls),
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # API URLs
    path('api/', include(router.urls)),
    # Auth URLs
    path('api/auth/', include('rest_framework.urls')),
    # Dashboard stats
    path('api/dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    # Root URL
    path('', api_root, name='api-root'),
]
