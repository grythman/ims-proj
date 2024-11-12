from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('mentor', 'Mentor'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )

    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='student'
    )
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True
    )
    organization = models.ForeignKey(
        'companies.Organization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='members'
    )
    department = models.ForeignKey(
        'companies.Department',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='members'
    )
    bio = models.TextField(blank=True)
    avatar = models.ImageField(
        upload_to='avatars/%Y/%m/',
        null=True,
        blank=True
    )
    skills = models.JSONField(default=list, blank=True)
    last_active = models.DateTimeField(null=True, blank=True)
    email_verified = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['user_type', 'username']),
            models.Index(fields=['email']),
            models.Index(fields=['organization', 'department']),
            models.Index(fields=['-last_active']),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"

    @property
    def is_student(self):
        return self.user_type == 'student'

    @property
    def is_mentor(self):
        return self.user_type == 'mentor'

    @property
    def is_teacher(self):
        return self.user_type == 'teacher'

    @property
    def is_admin_user(self):
        return self.user_type == 'admin'

    def get_notification_settings(self):
        try:
            return self.user_notification_preferences
        except NotificationPreference.DoesNotExist:
            return NotificationPreference.objects.create(
                user=self,
                **NotificationPreference.get_default_preferences()
            )

class NotificationPreference(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='user_notification_preferences'
    )
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    report_notifications = models.BooleanField(default=True)
    task_notifications = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'

    def __str__(self):
        return f"Notification preferences for {self.user.username}"

    @classmethod
    def get_default_preferences(cls):
        return {
            'email_notifications': True,
            'push_notifications': True,
            'report_notifications': True,
            'task_notifications': True,
            'message_notifications': True
        }

    def update_last_active(self):
        from django.utils import timezone
        self.user.last_active = timezone.now()
        self.user.save(update_fields=['last_active'])

    @property
    def is_student(self):
        return self.user.user_type == 'student'

    @property
    def is_mentor(self):
        return self.user.user_type == 'mentor'

    @property
    def is_teacher(self):
        return self.user.user_type == 'teacher'

    @property
    def is_admin_user(self):
        return self.user.user_type == 'admin'

    @property
    def full_name(self):
        return self.user.get_full_name() or self.user.username

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.user.user_type == 'student' and not self.user.email:
            raise ValidationError('Students must provide an email address')

class Activity(models.Model):
    ACTIVITY_TYPES = (
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('profile_update', 'Profile Update'),
        ('password_change', 'Password Change'),
        ('registration', 'Registration'),
    )

    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='activities'
    )
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Activities'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['activity_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} - {self.created_at}"