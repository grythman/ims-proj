from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    USER_TYPES = (
        ('student', 'Student'),
        ('mentor', 'Mentor'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )

    # Add related_name to fix the clashing accessors
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        related_name='custom_user_set',
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        related_name='custom_user_set',
        help_text=_('Specific permissions for this user.'),
    )

    # Add user_type field
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPES, 
        default='student'
    )
    phone = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    skills = models.JSONField(default=list, blank=True, null=True)
    last_active = models.DateTimeField(auto_now=True)
    email_verified = models.BooleanField(default=False)
    
    # Student specific fields
    student_id = models.CharField(max_length=20, blank=True, null=True)
    major = models.CharField(max_length=100, blank=True, null=True)
    year_of_study = models.IntegerField(null=True, blank=True)
    
    # Mentor specific fields
    company = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    expertise = models.JSONField(default=list, blank=True, null=True)
    
    # Teacher specific fields
    department_name = models.CharField(max_length=100, blank=True, null=True)
    faculty_id = models.CharField(max_length=20, blank=True, null=True)
    subject_area = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.username

class Activity(models.Model):
    ACTIVITY_TYPES = (
        ('login', 'Login'),
        ('profile_update', 'Profile Update'),
        ('internship_action', 'Internship Action'),
        ('report_submission', 'Report Submission'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = _('activity')
        verbose_name_plural = _('activities')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"

class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = _('notification preference')
        verbose_name_plural = _('notification preferences')

    def __str__(self):
        return f"{self.user.username}'s notification preferences"