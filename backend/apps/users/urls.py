from django.urls import path
from .views import LoginView, UserViewSet, RegisterView, AdminViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserViewSet.as_view({'get': 'me', 'put': 'me'}), name='user-me'),
    path('me/stats/', UserViewSet.as_view({'get': 'stats'}), name='user-stats'),
    path('admin/dashboard/', AdminViewSet.as_view({'get': 'dashboard'}), name='admin-dashboard'),
    path('admin/approve-user/', AdminViewSet.as_view({'post': 'approve_user'}), name='approve-user'),
    path('admin/approve-organization/', AdminViewSet.as_view({'post': 'approve_organization'}), name='approve-organization'),
] + router.urls 