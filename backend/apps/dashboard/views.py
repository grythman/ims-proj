from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import DashboardMetric, Activity
from .serializers import DashboardMetricSerializer, ActivitySerializer
from apps.users.models import User
from apps.reports.models import Report
from apps.internships.models import Internship

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_teacher_stats(self, user):
        today = timezone.now()
        thirty_days_ago = today - timedelta(days=30)

        # Get base querysets
        students = User.objects.filter(user_type='student')
        internships = Internship.objects.all()
        reports = Report.objects.all()

        # Calculate stats
        stats = {
            'total_students': students.count(),
            'active_internships': internships.filter(status='active').count(),
            'pending_reports': reports.filter(status='pending').count(),
            'completion_rate': internships.filter(status='completed').count() / internships.count() * 100 if internships.exists() else 0,
            'recent_activities': Activity.objects.select_related('user').order_by('-created_at')[:10],
            'metrics': {
                'weekly_reports': reports.filter(
                    created_at__gte=thirty_days_ago,
                    type='weekly'
                ).count(),
                'active_mentors': User.objects.filter(
                    user_type='mentor',
                    is_active=True
                ).count()
            }
        }

        return stats

    def get_mentor_stats(self, user):
        return {
            'assigned_interns': Internship.objects.filter(mentor=user).count(),
            'active_interns': Internship.objects.filter(
                mentor=user,
                status='active'
            ).count(),
            'pending_reports': Report.objects.filter(
                mentor=user,
                status='pending'
            ).count(),
            'recent_activities': Activity.objects.filter(
                Q(user=user) | Q(user__internships__mentor=user)
            ).select_related('user').order_by('-created_at')[:10]
        }

    def get_student_stats(self, user):
        internship = Internship.objects.filter(student=user).first()
        return {
            'internship_status': internship.status if internship else None,
            'reports_submitted': Report.objects.filter(student=user).count(),
            'reports_approved': Report.objects.filter(
                student=user,
                status='approved'
            ).count(),
            'recent_activities': Activity.objects.filter(
                user=user
            ).select_related('user').order_by('-created_at')[:10]
        }

    def list(self, request):
        user = request.user
        if user.user_type == 'teacher':
            data = self.get_teacher_stats(user)
        elif user.user_type == 'mentor':
            data = self.get_mentor_stats(user)
        elif user.user_type == 'student':
            data = self.get_student_stats(user)
        else:
            data = {}

        return Response(data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_metrics(request):
    """Get dashboard metrics for charts and graphs."""
    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    metrics = DashboardMetric.objects.filter(
        date__gte=start_date
    ).order_by('date', 'name')
    
    serializer = DashboardMetricSerializer(metrics, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_activities(request):
    """Get recent activities for the dashboard."""
    user = request.user
    limit = int(request.GET.get('limit', 10))

    if user.user_type == 'student':
        activities = Activity.objects.filter(user=user)
    elif user.user_type == 'mentor':
        activities = Activity.objects.filter(
            Q(user=user) | Q(user__internships__mentor=user)
        )
    else:
        activities = Activity.objects.all()

    activities = activities.select_related('user').order_by('-created_at')[:limit]
    serializer = ActivitySerializer(activities, many=True)
    return Response(serializer.data)
