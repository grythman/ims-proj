from django.db import models

# Create your models here.

class Notification(models.Model):
    TYPE_CHOICES = [
        ('APPLICATION_UPDATE', 'Application Update'),
        ('INTERNSHIP_UPDATE', 'Internship Update'),
        ('SYSTEM', 'System Notification')
    ]

    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
