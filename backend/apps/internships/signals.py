from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Internship, Task
from apps.notifications.services import NotificationService
from apps.dashboard.models import Activity

@receiver(post_save, sender=Internship)
def internship_post_save(sender, instance, created, **kwargs):
    if created:
        # Create activity record
        Activity.objects.create(
            user=instance.student,
            activity_type='internship_start',
            description=f'Started internship at {instance.organization.name}'
        )
        
        # Notify relevant users
        NotificationService.create_notification(
            recipient=instance.student,
            title='Internship Started',
            message=f'Your internship at {instance.organization.name} has started',
            notification_type='internship'
        )
        
        if instance.mentor:
            NotificationService.create_notification(
                recipient=instance.mentor,
                title='New Intern Assigned',
                message=f'You have been assigned as mentor for {instance.student.get_full_name()}',
                notification_type='internship'
            )

@receiver(pre_save, sender=Internship)
def internship_status_change(sender, instance, **kwargs):
    if instance.pk:  # Only for existing instances
        old_instance = Internship.objects.get(pk=instance.pk)
        if old_instance.status != instance.status:
            # Create activity record
            Activity.objects.create(
                user=instance.student,
                activity_type='internship_status',
                description=f'Internship status changed to {instance.get_status_display()}'
            )

@receiver(post_save, sender=Task)
def task_post_save(sender, instance, created, **kwargs):
    if created:
        # Notify student about new task
        NotificationService.create_notification(
            recipient=instance.internship.student,
            title='New Task Assigned',
            message=f'You have been assigned a new task: {instance.title}',
            notification_type='task'
        )
    else:
        # If task is completed
        if instance.status == 'completed':
            # Create activity record
            Activity.objects.create(
                user=instance.internship.student,
                activity_type='task_completion',
                description=f'Completed task: {instance.title}'
            )
            
            # Notify mentor
            if instance.internship.mentor:
                NotificationService.create_notification(
                    recipient=instance.internship.mentor,
                    title='Task Completed',
                    message=f'{instance.internship.student.get_full_name()} completed task: {instance.title}',
                    notification_type='task'
                ) 