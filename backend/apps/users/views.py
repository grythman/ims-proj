from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Activity
from .permissions import IsUserManagerOrSelf, CanManageUsers
from .serializers import (
    UserSerializer, 
    UserCreateSerializer,
    LoginSerializer,
    TokenObtainPairResponseSerializer
)

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        token = serializer.validated_data['token']
        
        # Update last login
        user.last_active = timezone.now()
        user.save(update_fields=['last_active'])
        
        # Log login activity
        Activity.objects.create(
            user=user,
            activity_type='login',
            description=f'User logged in successfully',
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        response_serializer = TokenObtainPairResponseSerializer({
            'user': user,
            'access': token['access'],
            'refresh': token['refresh']
        })
        
        return Response(response_serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsUserManagerOrSelf]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'register']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsUserManagerOrSelf()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Return user data without sensitive information
        return Response(
            UserSerializer(user, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

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
