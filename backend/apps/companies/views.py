from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Company
from .serializers import CompanySerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Company.objects.all()
        if self.request.user.role == 'COMPANY_REP':
            queryset = queryset.filter(contact_person=self.request.user)
        return queryset

    @action(detail=True, methods=['get'])
    def internships(self, request, pk=None):
        company = self.get_object()
        internships = company.internship_set.all()
        from apps.internships.serializers import InternshipSerializer
        serializer = InternshipSerializer(internships, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        company = self.get_object()
        company.is_active = True
        company.save()
        return Response({'status': 'company activated'})
