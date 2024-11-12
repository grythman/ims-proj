from rest_framework import serializers
from django.db.models import Count
from .models import Organization, Department
from apps.users.serializers import UserSerializer

class DepartmentSerializer(serializers.ModelSerializer):
    head_details = UserSerializer(source='head', read_only=True)
    member_count = serializers.SerializerMethodField()
    intern_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            'id', 'name', 'description', 'head', 'head_details',
            'member_count', 'intern_count', 'is_active',
            'created_at', 'updated_at'
        ]

    def get_member_count(self, obj):
        return obj.members.count() if hasattr(obj, 'members') else 0

    def get_intern_count(self, obj):
        return obj.internships.filter(status='active').count()

class OrganizationSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    logo_url = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'description', 'website', 'address',
            'contact_person', 'contact_email', 'contact_phone',
            'logo', 'logo_url', 'is_active', 'departments',
            'stats', 'created_at', 'updated_at'
        ]

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
        return None

    def get_stats(self, obj):
        return {
            'department_count': obj.departments.count(),
            'active_interns': obj.internships.filter(status='active').count(),
            'total_interns': obj.internships.count(),
            'mentor_count': obj.departments.filter(
                head__user_type='mentor'
            ).count()
        }