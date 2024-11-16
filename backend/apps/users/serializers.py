from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.admin.models import LogEntry
from .models import User, Activity, NotificationPreference

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'confirm_password',
            'first_name', 'last_name', 'user_type', 'phone',
            'bio', 'avatar', 'skills',
            # Student fields
            'student_id', 'major', 'year_of_study',
            # Mentor fields
            'company', 'position', 'expertise',
            # Teacher fields
            'department_name', 'faculty_id', 'subject_area'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'user_type': {'required': True},
        }

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match"})

        # Validate required fields based on user_type
        user_type = data.get('user_type')
        if user_type == 'student':
            if not data.get('student_id'):
                raise serializers.ValidationError({"student_id": "Student ID is required for students"})
            if not data.get('major'):
                raise serializers.ValidationError({"major": "Major is required for students"})
        elif user_type == 'mentor':
            if not data.get('company'):
                raise serializers.ValidationError({"company": "Company is required for mentors"})
            if not data.get('position'):
                raise serializers.ValidationError({"position": "Position is required for mentors"})
        elif user_type == 'teacher':
            if not data.get('department_name'):
                raise serializers.ValidationError({"department_name": "Department name is required for teachers"})
            if not data.get('faculty_id'):
                raise serializers.ValidationError({"faculty_id": "Faculty ID is required for teachers"})

        return data

    def create(self, validated_data):
        # Remove confirm_password from the data
        validated_data.pop('confirm_password', None)
        
        # Extract password
        password = validated_data.pop('password')
        
        # Create user instance
        user = User.objects.create(**validated_data)
        
        # Set password properly
        user.set_password(password)
        user.save()
        
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials")

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user', 'activity_type', 'description', 'created_at', 'metadata']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['id', 'user', 'email_notifications', 'push_notifications', 'sms_notifications']