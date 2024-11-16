from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from .serializers import UserSerializer, LoginSerializer, ActivitySerializer, NotificationPreferenceSerializer
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

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'status': 'success',
                'message': 'User registered successfully',
                'data': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'message': 'Registration failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user': UserSerializer(user).data
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
