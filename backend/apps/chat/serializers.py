from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message, ChatRoomParticipant

User = get_user_model()

class ChatParticipantSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoomParticipant
        fields = [
            'user_id', 'username', 'full_name', 
            'last_read_at', 'joined_at', 'is_admin',
            'unread_count'
        ]

    def get_unread_count(self, obj):
        if hasattr(obj, 'unread_count'):
            return obj.unread_count
        return 0

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    file_url = serializers.SerializerMethodField()
    read_by_count = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'content', 'sender', 'sender_name',
            'file', 'file_url', 'is_system_message',
            'created_at', 'read_by_count'
        ]
        read_only_fields = ['sender', 'is_system_message']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None

    def get_read_by_count(self, obj):
        return obj.read_by.count()

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = ChatParticipantSerializer(
        source='chatroomparticipant_set',
        many=True, 
        read_only=True
    )
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'type', 'participants',
            'last_message', 'unread_count',
            'created_at', 'last_message_at'
        ]

    def get_last_message(self, obj):
        last_message = obj.messages.first()
        if last_message:
            return MessageSerializer(last_message, context=self.context).data
        return None

    def get_unread_count(self, obj):
        user = self.context['request'].user
        participant = obj.chatroomparticipant_set.filter(user=user).first()
        if participant and participant.last_read_at:
            return obj.messages.filter(
                created_at__gt=participant.last_read_at
            ).count()
        return obj.messages.count() 