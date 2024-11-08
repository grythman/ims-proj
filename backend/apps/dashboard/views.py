from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.users.models import User
from apps.companies.models import Company
from .models import Internship

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    stats = {
        'students': User.objects.filter(role='STUDENT').count(),
        'activeInternships': Internship.objects.filter(status='ACTIVE').count(),
        'companies': Company.objects.count(),
        'completedInternships': Internship.objects.filter(status='COMPLETED').count(),
    }

    recent_internships = Internship.objects.select_related('student', 'company')[:5]
    internships_data = [{
        'id': internship.id,
        'studentName': f"{internship.student.first_name} {internship.student.last_name}",
        'companyName': internship.company.name,
        'position': internship.position,
        'status': internship.status,
    } for internship in recent_internships]

    return Response({
        'stats': stats,
        'recentInternships': internships_data
    })
