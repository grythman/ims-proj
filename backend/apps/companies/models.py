from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

# Create your models here.

class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    address = models.TextField()
    contact_person = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    logo = models.ImageField(upload_to='organization_logos/%Y/%m/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_active', 'name']),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        if not self.contact_email or not self.contact_person:
            raise ValidationError("Contact information is required")

class Department(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    head = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='headed_departments'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        unique_together = ['organization', 'name']
        indexes = [
            models.Index(fields=['organization', 'name']),
            models.Index(fields=['is_active', 'name']),
        ]

    def __str__(self):
        return f"{self.name} - {self.organization.name}"

    def clean(self):
        if self.head and self.head.user_type not in ['teacher', 'mentor']:
            raise ValidationError("Department head must be a teacher or mentor")

# Alias for backward compatibility
Company = Organization

class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    # Using string reference to break circular dependency
    author = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='authored_news'
    )
    is_published = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
