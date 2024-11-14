from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'reports', views.ReportViewSet, basename='report')
router.register(r'evaluations', views.EvaluationViewSet, basename='evaluation')
router.register(r'internships', views.InternshipViewSet, basename='internship')

urlpatterns = [
    path('', include(router.urls)),
    path('student/dashboard/', views.StudentDashboardView.as_view(), name='student-dashboard'),
] 