from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from .serializers import UserSerializer, LoginSerializer, ActivitySerializer, NotificationPreferenceSerializer, UserRegistrationSerializer
from .permissions import IsUserManagerOrSelf, IsAdminUser
from .models import User, Activity, NotificationPreference
from django.contrib.auth import get_user_model, authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'User registered successfully',
                    'data': serializer.data
                }, status=201)
            except Exception as e:
                return Response({
                    'status': 'error',
                    'message': 'Registration failed',
                    'errors': str(e)
                }, status=400)
        else:
            return Response({
                'status': 'error',
                'message': 'Registration failed',
                'errors': serializer.errors
            }, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': UserSerializer(user).data
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsUserManagerOrSelf]

    @action(detail=False)
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False)
    def stats(self, request):
        user = request.user
        stats = {}

        if user.user_type == 'student':
            stats = {
                'internships': user.internships.count(),
                'reports_submitted': user.submitted_reports.count(),
                'tasks_completed': user.tasks.filter(status='completed').count()
            }
        elif user.user_type == 'mentor':
            stats = {
                'assigned_students': user.mentored_internships.count(),
                'pending_reports': user.reviewed_reports.filter(status='pending').count()
            }
        elif user.user_type in ['teacher', 'admin']:
            stats = {
                'total_students': User.objects.filter(user_type='student').count(),
                'active_internships': user.internships.filter(status='active').count(),
                'pending_reports': user.reports.filter(status='pending').count()
            }

        return Response(stats)
