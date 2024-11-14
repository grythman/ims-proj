from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    USER_TYPES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('mentor', 'Mentor'),
        ('admin', 'Admin'),
    )

    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='student')
    phone = models.CharField(max_length=20, blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now=True)
    
    # Organization and Department relationships
    organization = models.ForeignKey(
        'companies.Organization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )
    department = models.ForeignKey(
        'companies.Department',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )
    
    # Student specific fields
    student_id = models.CharField(max_length=20, blank=True, null=True)
    major = models.CharField(max_length=100, blank=True, null=True)
    year_of_study = models.CharField(max_length=10, blank=True, null=True)
    
    # Mentor specific fields
    company = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    expertise = models.TextField(blank=True, null=True)
    
    # Teacher specific fields
    department_name = models.CharField(max_length=100, blank=True, null=True)
    faculty_id = models.CharField(max_length=50, blank=True, null=True)
    subject_area = models.CharField(max_length=100, blank=True, null=True)

    # Common optional fields
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    skills = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        db_table = 'auth_user'

    def __str__(self):
        return f"{self.get_full_name()} ({self.user_type})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}" if self.first_name else self.username

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

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)

        if is_new:
            # Set up permissions based on user type
            if self.user_type == 'student':
                from django.contrib.auth.models import Permission
                from django.contrib.contenttypes.models import ContentType
                from apps.internships.models import Report

                # Get content types
                report_ct = ContentType.objects.get_for_model(Report)

                # Define permissions for students
                student_permissions = [
                    Permission.objects.get_or_create(
                        codename='can_submit_reports',
                        name='Can submit reports',
                        content_type=report_ct,
                    )[0],
                    Permission.objects.get_or_create(
                        codename='can_view_own_reports',
                        name='Can view own reports',
                        content_type=report_ct,
                    )[0],
                ]

                # Assign permissions
                self.user_permissions.add(*student_permissions)

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