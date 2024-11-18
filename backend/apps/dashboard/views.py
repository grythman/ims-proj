from rest_framework import views, permissions
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from django.utils import timezone
from apps.internships.models import Internship, Task
from apps.reports.models import Report

class DashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # Add your dashboard data logic here
            data = {
                'status': 'success',
                'message': 'Dashboard data retrieved successfully',
                'data': {
                    # Add your dashboard data here
                    'example': 'data'
                }
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # Add your stats logic here
            data = {
                'status': 'success',
                'message': 'Stats retrieved successfully',
                'data': {
                    # Add your stats data here
                    'example': 'stats'
                }
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_type != 'student':
            return Response({
                'error': 'Only students can access this dashboard'
            }, status=status.HTTP_403_FORBIDDEN)

        # Get active internship and stats
        active_internship = Internship.objects.filter(
            student=user,
            status='active'
        ).first()

        # Get reports statistics
        reports = Report.objects.filter(student=user)
        report_stats = {
            'total': reports.count(),
            'pending': reports.filter(status='pending').count(),
            'approved': reports.filter(status='approved').count(),
            'rejected': reports.filter(status='rejected').count()
        }

        return Response({
            'active_internship': {
                'id': active_internship.id if active_internship else None,
                'organization': active_internship.organization.name if active_internship else None,
                'mentor': active_internship.mentor.get_full_name() if active_internship and active_internship.mentor else None,
            } if active_internship else None,
            'reports': report_stats,
            'recent_activities': self.get_recent_activities(user)
        })

    def get_recent_activities(self, user):
        # Implementation of get_recent_activities method...
        pass

class MentorDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_type != 'mentor':
            return Response({
                'error': 'Only mentors can access this dashboard'
            }, status=status.HTTP_403_FORBIDDEN)

        # Get mentored internships
        internships = Internship.objects.filter(mentor=user)
        
        # Get reports pending review
        pending_reports = Report.objects.filter(
            mentor=user,
            status='pending'
        )

        return Response({
            'mentored_students': {
                'total': internships.count(),
                'active': internships.filter(status='active').count()
            },
            'reports': {
                'pending_review': pending_reports.count(),
                'recent': self.get_recent_reports(user)
            },
            'recent_activities': self.get_recent_activities(user)
        })

    def get_recent_reports(self, user):
        return Report.objects.filter(
            mentor=user
        ).order_by('-created_at')[:5].values('id', 'title', 'student__username', 'status')

    def get_recent_activities(self, user):
        # Implementation of get_recent_activities method...
        pass

class TeacherDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_type != 'teacher':
            return Response({
                'error': 'Only teachers can access this dashboard'
            }, status=status.HTTP_403_FORBIDDEN)

        # Get supervised internships
        internships = Internship.objects.filter(teacher=user)
        
        return Response({
            'supervised_internships': {
                'total': internships.count(),
                'active': internships.filter(status='active').count()
            },
            'students': self.get_student_stats(),
            'recent_activities': self.get_recent_activities(user)
        })

    def get_student_stats(self):
        # Implementation of get_student_stats method...
        pass

    def get_recent_activities(self, user):
        # Implementation of get_recent_activities method...
        pass

class AdminDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_staff:
            return Response({
                'error': 'Only admin users can access this dashboard'
            }, status=status.HTTP_403_FORBIDDEN)

        return Response({
            'system_stats': self.get_system_stats(),
            'recent_activities': self.get_recent_activities()
        })

    def get_system_stats(self):
        # Implementation of get_system_stats method...
        pass

    def get_recent_activities(self):
        # Implementation of get_recent_activities method...
        pass

class StudentActivitiesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_type != 'student':
            return Response({
                'error': 'Only students can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # Get recent reports
            reports = Report.objects.filter(
                student=user
            ).order_by('-created_at')[:5]

            # Get recent tasks
            tasks = Task.objects.filter(
                internship__student=user
            ).order_by('-created_at')[:5]

            # Combine and format activities
            activities = []

            for report in reports:
                activities.append({
                    'id': f'report_{report.id}',
                    'type': 'report',
                    'title': report.title,
                    'status': report.status,
                    'date': report.created_at,
                    'description': f'Report {report.get_status_display()}'
                })

            for task in tasks:
                activities.append({
                    'id': f'task_{task.id}',
                    'type': 'task',
                    'title': task.title,
                    'status': task.status,
                    'date': task.created_at,
                    'description': f'Task {task.get_status_display()}'
                })

            # Sort activities by date
            activities.sort(key=lambda x: x['date'], reverse=True)

            return Response({
                'status': 'success',
                'data': activities[:5]  # Return only the 5 most recent activities
            })

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
