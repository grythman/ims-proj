from rest_framework import serializers
from .models import Internship, Application
from apps.companies.serializers import CompanySerializer
from apps.users.serializers import UserSerializer

class InternshipSerializer(serializers.ModelSerializer):
    company_details = CompanySerializer(source='company', read_only=True)
    supervisor_details = UserSerializer(source='supervisor', read_only=True)
    applications_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Internship
        fields = ['id', 'company', 'company_details', 'position',
                 'description', 'requirements', 'start_date', 'end_date',
                 'status', 'supervisor', 'supervisor_details',
                 'max_applications', 'applications_count',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_applications_count(self, obj):
        return obj.application_set.count()

    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError(
                    "End date must be after start date"
                )
        return data

class InternshipListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name')
    
    class Meta:
        model = Internship
        fields = ['id', 'company_name', 'position', 'status', 'start_date']

class ApplicationSerializer(serializers.ModelSerializer):
    student_details = UserSerializer(source='student', read_only=True)
    internship_details = InternshipListSerializer(source='internship', read_only=True)
    
    class Meta:
        model = Application
        fields = ['id', 'internship', 'internship_details', 
                 'student', 'student_details', 'status',
                 'cover_letter', 'resume', 'applied_at', 'updated_at']
        read_only_fields = ['id', 'student', 'applied_at', 'updated_at']

    def validate(self, data):
        # Check if student has already applied
        if self.context['request'].method == 'POST':
            student = self.context['request'].user
            internship = data['internship']
            if Application.objects.filter(
                student=student, 
                internship=internship
            ).exists():
                raise serializers.ValidationError(
                    "You have already applied for this internship"
                )
            
            # Check if internship is still open
            if internship.status != 'OPEN':
                raise serializers.ValidationError(
                    "This internship is no longer accepting applications"
                )
            
            # Check if maximum applications reached
            if (internship.application_set.count() >= 
                internship.max_applications):
                raise serializers.ValidationError(
                    "This internship has reached maximum applications"
                )
        return data 