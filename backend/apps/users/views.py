from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .serializers import UserSerializer, UserCreateSerializer, AdminDashboardSerializer, LoginSerializer
from .permissions import IsUserManagerOrSelf, IsAdminUser
from .models import User
from apps.internships.models import Internship
from apps.reports.models import Report
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model, authenticate, login
from apps.companies.models import Organization
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'register']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsUserManagerOrSelf()]

    @action(detail=False)
    def stats(self, request):
        user = request.user
        stats = {}

        if user.user_type == 'student':
            stats = {
                'internships': user.internships.count(),
                'active_internship': user.internships.filter(status='active').exists(),
                'reports_submitted': user.submitted_reports.count(),
                'reports_approved': user.submitted_reports.filter(status='approved').count(),
                'tasks_completed': user.tasks.filter(status='completed').count(),
                'tasks_pending': user.tasks.filter(status='pending').count()
            }
        elif user.user_type == 'mentor':
            stats = {
                'assigned_students': user.mentored_internships.count(),
                'active_internships': user.mentored_internships.filter(status='active').count(),
                'pending_reports': user.reviewed_reports.filter(status='pending').count(),
                'total_evaluations': user.given_evaluations.count()
            }
        elif user.user_type in ['teacher', 'admin']:
            stats = {
                'total_students': User.objects.filter(user_type='student').count(),
                'active_internships': Internship.objects.filter(status='active').count(),
                'pending_reports': Report.objects.filter(status='pending').count(),
                'total_mentors': User.objects.filter(user_type='mentor').count()
            }

        return Response(stats)

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):
        if request.method == 'GET':
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            print("Received registration data:", request.data)  # Debug log
            
            # Create a mutable copy of the data
            data = request.data.copy()
            
            # Add default values for optional fields based on user_type
            user_type = data.get('user_type')
            if user_type == 'student':
                data.setdefault('company', '')
                data.setdefault('position', '')
                data.setdefault('expertise', '')
                data.setdefault('department_name', '')
                data.setdefault('faculty_id', '')
                data.setdefault('subject_area', '')
            elif user_type == 'mentor':
                data.setdefault('student_id', '')
                data.setdefault('major', '')
                data.setdefault('year_of_study', '')
                data.setdefault('department_name', '')
                data.setdefault('faculty_id', '')
                data.setdefault('subject_area', '')
            elif user_type == 'teacher':
                data.setdefault('student_id', '')
                data.setdefault('major', '')
                data.setdefault('year_of_study', '')
                data.setdefault('company', '')
                data.setdefault('position', '')
                data.setdefault('expertise', '')

            serializer = UserCreateSerializer(data=data)
            
            if serializer.is_valid():
                user = serializer.save()
                print(f"User created successfully: {user.username}")  # Debug log
                return Response({
                    'message': 'Registration successful',
                    'user_id': user.id
                }, status=status.HTTP_201_CREATED)
            
            print("Serializer errors:", serializer.errors)  # Debug log
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print("Registration error:", str(e))  # Debug log
            return Response({
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class AdminViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    @action(detail=False, methods=['GET'])
    def dashboard(self, request):
        """Get admin dashboard data"""
        data = {
            'users': {
                'total': User.objects.count(),
                'students': User.objects.filter(user_type='student').count(),
                'mentors': User.objects.filter(user_type='mentor').count(),
                'teachers': User.objects.filter(user_type='teacher').count(),
            },
            'internships': {
                'total': Internship.objects.count(),
                'active': Internship.objects.filter(status='active').count(),
                'completed': Internship.objects.filter(status='completed').count(),
            },
            'recent_activities': LogEntry.objects.select_related('user')[:10],
            'pending_approvals': {
                'organizations': Organization.objects.filter(is_active=False).count(),
                'mentors': User.objects.filter(user_type='mentor', is_active=False).count(),
            }
        }
        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'])
    def approve_user(self, request):
        """Approve a user account"""
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            user.is_active = True
            user.save()
            return Response({'status': 'user approved'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    @action(detail=False, methods=['POST'])
    def approve_organization(self, request):
        """Approve an organization"""
        org_id = request.data.get('organization_id')
        try:
            org = Organization.objects.get(id=org_id)
            org.is_active = True
            org.save()
            return Response({'status': 'organization approved'})
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=404)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['POST'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        try:
            # Try to get the user first
            user = User.objects.get(username=username)
            
            # Then authenticate
            if user.check_password(password):
                login(request, user)
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                response_data = {
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    }
                }
                
                # Add admin-specific data if user is admin
                if user.user_type == 'admin':
                    response_data.update({
                        'is_admin': True,
                        'admin_url': '/admin/'
                    })
                
                return Response(response_data)
            
        except User.DoesNotExist:
            pass
        
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

    @action(detail=False)
    def me(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            print(f"Login attempt with email/username: {email}")  # Debug log
            
            if not email or not password:
                return Response({
                    'error': 'Please provide both email and password'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Try to authenticate with email first
            try:
                user = User.objects.get(email=email)
                username = user.username
            except User.DoesNotExist:
                # If not found by email, try username directly
                username = email

            # Authenticate with username
            user = authenticate(request, username=username, password=password)
            print(f"Authentication result for {username}: {user}")  # Debug log

            if not user:
                return Response({
                    'error': 'Invalid credentials. Please try again.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            if not user.is_active:
                return Response({
                    'error': 'This account is inactive'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Login the user
            login(request, user)

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }

            print(f"Login successful for {user.username}")  # Debug log
            return Response(response_data)
            
        except Exception as e:
            print(f"Login error: {str(e)}")  # Debug log
            return Response({
                'error': 'Invalid credentials. Please try again.'
            }, status=status.HTTP_401_UNAUTHORIZED)
