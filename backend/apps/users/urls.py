from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.UserViewSet, basename='user')

urlpatterns = [
    path('me/', views.UserViewSet.as_view({'get': 'me'}), name='user-me'),
    path('register/', views.UserViewSet.as_view({'post': 'create'}), name='user-register'),
    path('', include(router.urls)),
] 