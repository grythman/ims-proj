from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.admin.models import LogEntry
from .models import User, Activity, NotificationPreference

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

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
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError({
                'error': 'Both username and password are required.'
            })

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError({
                'error': 'Invalid credentials.'
            })

        if not user.is_active:
            raise serializers.ValidationError({
                'error': 'User account is disabled.'
            })

        attrs['user'] = user
        return attrs

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user', 'activity_type', 'description', 'created_at', 'metadata']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['id', 'user', 'email_notifications', 'push_notifications', 'sms_notifications']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'user_type')

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            user_type=validated_data['user_type']
        )
        return user