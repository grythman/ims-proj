from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Organization, Department
from apps.dashboard.models import DashboardStat

@receiver([post_save, post_delete], sender=Organization)
def update_organization_stats(sender, instance, **kwargs):
    # Update dashboard stats when organization changes
    try:
        dashboard_stat = DashboardStat.objects.get(organization=instance)
        dashboard_stat.update_stats()
    except DashboardStat.DoesNotExist:
        DashboardStat.objects.create(organization=instance)

@receiver(post_save, sender=Department)
def department_post_save(sender, instance, created, **kwargs):
    if created and instance.head:
        # Notify department head
        from apps.notifications.services import NotificationService
        NotificationService.create_notification(
            recipient=instance.head,
            title=f"New Department Assignment",
            message=f"You have been assigned as head of {instance.name} department",
            notification_type='system'
        ) 