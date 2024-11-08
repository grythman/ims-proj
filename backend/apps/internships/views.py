from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Internship, Application
from .serializers import InternshipSerializer, ApplicationSerializer

class InternshipViewSet(viewsets.ModelViewSet):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Internship.objects.all()
        status = self.request.query_params.get('status', None)
        company = self.request.query_params.get('company', None)
        
        if status:
            queryset = queryset.filter(status=status)
        if company:
            queryset = queryset.filter(company_id=company)
            
        return queryset

    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        internship = self.get_object()
        applications = internship.application_set.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'STUDENT':
            return Application.objects.filter(student=self.request.user)
        elif self.request.user.role == 'COMPANY_REP':
            return Application.objects.filter(
                internship__company__contact_person=self.request.user
            )
        return Application.objects.all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Application.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        return Response({'status': 'updated'})
