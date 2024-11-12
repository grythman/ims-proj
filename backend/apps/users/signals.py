from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, NotificationPreference
from apps.notifications.services import NotificationService

@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    if created:
        # Create notification preferences
        NotificationPreference.objects.get_or_create(
            user=instance,
            defaults=NotificationPreference.get_default_preferences()
        )

        # Create welcome notification
        NotificationService.create_notification(
            recipient=instance,
            title='Welcome to IMS',
            message=f'Welcome to the Internship Management System, {instance.get_full_name() or instance.username}!',
            notification_type='system'
        )

@receiver(post_save, sender=User)
def save_user_notification_preferences(sender, instance, **kwargs):
    try:
        instance.user_notification_preferences.save()
    except NotificationPreference.DoesNotExist:
        NotificationPreference.objects.create(
            user=instance,
            **NotificationPreference.get_default_preferences()
        )