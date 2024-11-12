from django.db import models
from django.conf import settings

# Create your models here.

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('report', 'Report'),
        ('task', 'Task'),
        ('meeting', 'Meeting'),
        ('message', 'Message'),
        ('system', 'System'),
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    related_object_id = models.IntegerField(null=True, blank=True)
    related_object_type = models.CharField(max_length=50, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['notification_type', 'related_object_id']),
            models.Index(fields=['is_read', '-created_at']),
        ]

    def __str__(self):
        return f"{self.notification_type} notification for {self.recipient.username}"

class NotificationPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='system_notification_preferences'
    )
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    report_notifications = models.BooleanField(default=True)
    task_notifications = models.BooleanField(default=True)
    meeting_notifications = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Notification preferences for {self.user.username}"
