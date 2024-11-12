from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Organization, Department
from .serializers import OrganizationSerializer, DepartmentSerializer
from .permissions import IsOrganizationAdmin

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description', 'contact_person']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        queryset = Organization.objects.prefetch_related(
            'departments',
            'departments__head',
            'internships'
        ).annotate(
            active_interns=Count('internships', filter=Q(internships__status='active')),
            total_interns=Count('internships'),
            mentor_count=Count('departments__head', filter=Q(departments__head__user_type='mentor'))
        )
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOrganizationAdmin()]
        return [permissions.IsAuthenticated()]

    @action(detail=True)
    def stats(self, request, pk=None):
        organization = self.get_object()
        return Response({
            'departments': organization.departments.count(),
            'active_interns': organization.internships.filter(status='active').count(),
            'total_interns': organization.internships.count(),
            'mentors': organization.departments.filter(head__user_type='mentor').count()
        })

class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'organization']
    search_fields = ['name', 'description']

    def get_queryset(self):
        return Department.objects.select_related(
            'organization', 
            'head'
        ).prefetch_related(
            'internships'
        ).annotate(
            intern_count=Count('internships', filter=Q(internships__status='active'))
        )
