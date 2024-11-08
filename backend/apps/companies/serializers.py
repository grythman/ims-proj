from rest_framework import serializers
from .models import Company
from apps.users.serializers import UserSerializer

class CompanySerializer(serializers.ModelSerializer):
    contact_person_details = UserSerializer(source='contact_person', read_only=True)
    active_internships_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'address', 'website',
                 'contact_person', 'contact_person_details', 
                 'phone', 'email', 'logo', 'is_active',
                 'active_internships_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_active_internships_count(self, obj):
        return obj.internship_set.filter(status='OPEN').count()

class CompanyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'logo', 'is_active'] 