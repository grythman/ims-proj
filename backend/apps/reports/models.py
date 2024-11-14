from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

# Create your models here.

class Report(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('revised', 'Needs Revision')
    )

    TYPE_CHOICES = (
        ('weekly', 'Weekly Report'),
        ('monthly', 'Monthly Report'),
        ('final', 'Final Report'),
        ('special', 'Special Report')
    )

    title = models.CharField(max_length=255)
    content = models.TextField()
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='general_reports'
    )
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviewed_reports'
    )
    internship = models.ForeignKey(
        'internships.Internship',
        on_delete=models.CASCADE,
        related_name='progress_reports'
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft'
    )
    feedback = models.TextField(blank=True)
    file = models.FileField(
        upload_to='reports/%Y/%m/%d/',
        null=True,
        blank=True
    )
    submission_date = models.DateTimeField(null=True, blank=True)
    review_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['mentor', 'status']),
            models.Index(fields=['internship', '-created_at']),
            models.Index(fields=['type', 'status']),
            models.Index(fields=['-submission_date']),
        ]
        permissions = [
            ("can_review_reports", "Can review reports"),
            ("can_export_reports", "Can export reports"),
        ]

    def __str__(self):
        return f"{self.title} - {self.student.username}"

    def clean(self):
        if self.status == 'approved' and not self.mentor:
            raise ValidationError("Approved reports must have a mentor assigned")
        if self.status != 'draft' and not self.submission_date:
            raise ValidationError("Submitted reports must have a submission date")

    def submit(self):
        if self.status == 'draft':
            self.status = 'pending'
            self.submission_date = timezone.now()
            self.save()

    def review(self, status, feedback=None):
        valid_statuses = ['approved', 'rejected', 'revised']
        if status not in valid_statuses:
            raise ValidationError(f"Invalid review status. Must be one of: {', '.join(valid_statuses)}")
        
        self.status = status
        if feedback:
            self.feedback = feedback
        self.review_date = timezone.now()
        self.save()

class ReportComment(models.Model):
    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    content = models.TextField()
    attachment = models.FileField(
        upload_to='report_comments/%Y/%m/%d/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['report', 'created_at']),
            models.Index(fields=['author', 'created_at']),
        ]

    def __str__(self):
        return f"Comment by {self.author.username} on {self.report.title}"

class ReportTemplate(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    content_template = models.TextField()
    report_type = models.CharField(max_length=10, choices=Report.TYPE_CHOICES)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['report_type', 'is_active']),
        ]

    def __str__(self):
        return self.name
