from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.admin.models import LogEntry
from .models import User
from apps.internships.models import Internship
from apps.companies.models import Organization

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    user_type_display = serializers.CharField(source='get_user_type_display', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'user_type', 'user_type_display', 'phone',
            'organization', 'organization_name', 'department',
            'department_name', 'bio', 'avatar', 'skills',
            'last_active', 'email_verified', 'date_joined'
        ]
        read_only_fields = ['email_verified', 'last_active', 'date_joined']

class UserCreateSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'user_type', 'phone',
            'student_id', 'major', 'year_of_study',
            'company', 'position', 'expertise',
            'department_name', 'faculty_id', 'subject_area'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'password2': {'write_only': True, 'required': True},
            'student_id': {'required': False},
            'major': {'required': False},
            'year_of_study': {'required': False},
            'company': {'required': False},
            'position': {'required': False},
            'expertise': {'required': False},
            'department_name': {'required': False},
            'faculty_id': {'required': False},
            'subject_area': {'required': False},
        }

    def validate(self, data):
        # Check if both passwords are provided
        if 'password' not in data or 'password2' not in data:
            raise serializers.ValidationError({
                "password": "Both password fields are required."
            })

        # Check if passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError({
                "password": "Passwords do not match."
            })
        
        # Remove password2 from the data
        data.pop('password2')
        
        # Validate role-specific fields
        user_type = data.get('user_type')
        if user_type == 'student':
            if not data.get('student_id'):
                raise serializers.ValidationError({
                    "student_id": "Student ID is required for students"
                })
            if not data.get('major'):
                raise serializers.ValidationError({
                    "major": "Major is required for students"
                })
            if not data.get('year_of_study'):
                raise serializers.ValidationError({
                    "year_of_study": "Year of study is required for students"
                })
        elif user_type == 'mentor':
            if not data.get('company'):
                raise serializers.ValidationError({
                    "company": "Company is required for mentors"
                })
            if not data.get('position'):
                raise serializers.ValidationError({
                    "position": "Position is required for mentors"
                })
        elif user_type == 'teacher':
            if not data.get('department_name'):
                raise serializers.ValidationError({
                    "department_name": "Department is required for teachers"
                })
            if not data.get('faculty_id'):
                raise serializers.ValidationError({
                    "faculty_id": "Faculty ID is required for teachers"
                })
            if not data.get('subject_area'):
                raise serializers.ValidationError({
                    "subject_area": "Subject area is required for teachers"
                })
        
        return data

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                user_type=validated_data['user_type'],
                phone=validated_data.get('phone', ''),
                student_id=validated_data.get('student_id', ''),
                major=validated_data.get('major', ''),
                year_of_study=validated_data.get('year_of_study', ''),
                company=validated_data.get('company', ''),
                position=validated_data.get('position', ''),
                expertise=validated_data.get('expertise', ''),
                department_name=validated_data.get('department_name', ''),
                faculty_id=validated_data.get('faculty_id', ''),
                subject_area=validated_data.get('subject_area', '')
            )
            return user
        except Exception as e:
            raise serializers.ValidationError(str(e))

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )

            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled.',
                    code='authorization'
                )

            refresh = RefreshToken.for_user(user)
            attrs['user'] = user
            attrs['token'] = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return attrs
        else:
            msg = 'Must include "username" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

class TokenObtainPairResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()

class AdminDashboardSerializer(serializers.Serializer):
    users = serializers.DictField(
        child=serializers.IntegerField(),
        read_only=True
    )
    internships = serializers.DictField(
        child=serializers.IntegerField(),
        read_only=True
    )
    pending_approvals = serializers.DictField(
        child=serializers.IntegerField(),
        read_only=True
    )
    recent_activities = serializers.SerializerMethodField()

    def get_recent_activities(self, obj):
        activities = obj.get('recent_activities', [])
        return [{
            'id': activity.id,
            'user': activity.user.username,
            'action': activity.get_action_flag_display(),
            'object': str(activity.object_repr),
            'time': activity.action_time
        } for activity in activities]

class LogEntrySerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')
    action = serializers.CharField(source='get_action_flag_display')
    
    class Meta:
        model = LogEntry
        fields = ['id', 'user', 'action', 'object_repr', 'action_time']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'first_name', 
                 'last_name', 'role', 'student_id', 'department')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "User with this email already exists."})

        if attrs['role'] == 'student' and not attrs.get('student_id'):
            raise serializers.ValidationError({"student_id": "Student ID is required for student role."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role'],
            student_id=validated_data.get('student_id'),
            department=validated_data.get('department')
        )

        user.set_password(validated_data['password'])
        user.save()

        return user