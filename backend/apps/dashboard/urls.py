from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'stats', views.DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('metrics/', views.dashboard_metrics, name='dashboard-metrics'),
    path('activities/', views.dashboard_activities, name='dashboard-activities'),
    path('', include(router.urls)),
] 