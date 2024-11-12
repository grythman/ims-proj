from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q, OuterRef, Subquery
from django.utils import timezone
from .models import ChatRoom, Message, ChatRoomParticipant
from .serializers import ChatRoomSerializer, MessageSerializer
from .permissions import IsChatParticipant

# Create your views here.

class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsChatParticipant]

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(
            participants=user
        ).prefetch_related(
            'participants',
            'chatroomparticipant_set'
        ).annotate(
            unread_count=Count(
                'messages',
                filter=Q(
                    created_at__gt=OuterRef('chatroomparticipant__last_read_at')
                )
            )
        )

    def perform_create(self, serializer):
        room = serializer.save()
        # Add creator as participant and admin
        ChatRoomParticipant.objects.create(
            chat_room=room,
            user=self.request.user,
            is_admin=True
        )
        # Add other participants
        participant_ids = self.request.data.get('participant_ids', [])
        for user_id in participant_ids:
            if user_id != self.request.user.id:
                ChatRoomParticipant.objects.create(
                    chat_room=room,
                    user_id=user_id
                )

    @action(detail=True)
    def messages(self, request, pk=None):
        room = self.get_object()
        messages = room.messages.select_related('sender').prefetch_related('read_by')
        
        # Update last read timestamp
        participant = room.chatroomparticipant_set.get(user=request.user)
        participant.last_read_at = timezone.now()
        participant.save()

        page = self.paginate_queryset(messages)
        serializer = MessageSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['POST'])
    def send_message(self, request, pk=None):
        room = self.get_object()
        serializer = MessageSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            message = serializer.save(
                room=room,
                sender=request.user
            )
            # Mark as read by sender
            message.read_by.add(request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def add_participants(self, request, pk=None):
        room = self.get_object()
        user_ids = request.data.get('user_ids', [])
        
        # Check if user is admin
        if not room.chatroomparticipant_set.get(user=request.user).is_admin:
            return Response(
                {'detail': 'Only admins can add participants'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Add new participants
        for user_id in user_ids:
            ChatRoomParticipant.objects.get_or_create(
                chat_room=room,
                user_id=user_id
            )

        return Response({'status': 'participants added'})

    @action(detail=True, methods=['POST'])
    def leave_chat(self, request, pk=None):
        room = self.get_object()
        participant = room.chatroomparticipant_set.get(user=request.user)
        participant.delete()
        
        # If no participants left, delete the room
        if room.participants.count() == 0:
            room.delete()
            
        return Response({'status': 'left chat'})

    @action(detail=True, methods=['POST'])
    def mark_read(self, request, pk=None):
        room = self.get_object()
        participant = room.chatroomparticipant_set.get(user=request.user)
        participant.last_read_at = timezone.now()
        participant.save()
        return Response({'status': 'marked as read'})
