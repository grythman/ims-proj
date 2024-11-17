from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('student/', views.StudentDashboardView.as_view(), name='student-dashboard'),
    path('mentor/', views.MentorDashboardView.as_view(), name='mentor-dashboard'),
    path('teacher/', views.TeacherDashboardView.as_view(), name='teacher-dashboard'),
    path('admin/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
] 