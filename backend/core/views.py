from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.internships.models import Internship
from apps.companies.models import Company
from apps.users.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    stats = {
        'totalInternships': Internship.objects.count(),
        'activeInternships': Internship.objects.filter(status='active').count(),
        'totalCompanies': Company.objects.count(),
        'pendingApplications': Internship.objects.filter(status='pending').count(),
        'totalUsers': User.objects.count(),
        'recentActivity': {
            'internships': Internship.objects.order_by('-created_at')[:5].values(),
            'companies': Company.objects.order_by('-created_at')[:5].values(),
        }
    }
    return Response(stats)

@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'Welcome to IMS API'
    }) 