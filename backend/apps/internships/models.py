from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Internship(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='internships'
    )
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='mentored_internships'
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='supervised_internships'
    )
    organization = models.ForeignKey(
        'companies.Organization',
        on_delete=models.CASCADE,
        related_name='internships'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.username}'s internship at {self.organization.name}"

    @property
    def duration_weeks(self):
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            return delta.days // 7
        return 0

    @property
    def is_active(self):
        return self.status == 'active'

class Task(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_tasks'
    )
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    hours_spent = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['due_date', '-priority']

    def __str__(self):
        return f"{self.title} - {self.internship.student.username}"

class Evaluation(models.Model):
    EVALUATOR_TYPES = (
        ('mentor', 'Mentor'),
        ('teacher', 'Teacher'),
    )

    report = models.ForeignKey(
        'Report',
        on_delete=models.CASCADE,
        related_name='evaluations',
        null=True,
        blank=True
    )
    evaluator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='given_evaluations'
    )
    evaluator_type = models.CharField(max_length=20, choices=EVALUATOR_TYPES)
    score = models.IntegerField(null=True, blank=True)
    comments = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Evaluation by {self.evaluator.username} ({self.evaluator_type})"

    def clean(self):
        if self.score is not None and (self.score < 0 or self.score > 100):
            raise ValidationError('Score must be between 0 and 100')

class Report(models.Model):
    REPORT_TYPES = (
        ('preliminary', 'Preliminary'),
        ('progress', 'Progress'),
        ('final', 'Final'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='internship_reports'
    )
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    file_attachment = models.FileField(upload_to='reports/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']

class PreliminaryReport(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('needs_revision', 'Needs Revision')
    )

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name='preliminary_reports'
    )
    content = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='draft'
    )
    feedback = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviewed_preliminary_reports'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Preliminary Report for {self.internship}"

class Agreement(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending_organization', 'Pending Organization Approval'),
        ('pending_university', 'Pending University Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    internship = models.OneToOneField(
        'Internship',
        on_delete=models.CASCADE,
        related_name='agreement'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='internship_agreements'
    )
    organization = models.ForeignKey(
        'companies.Organization',
        on_delete=models.CASCADE,
        related_name='internship_agreements'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='draft'
    )
    student_signature = models.BooleanField(default=False)
    organization_signature = models.BooleanField(default=False)
    university_signature = models.BooleanField(default=False)
    agreement_file = models.FileField(
        upload_to='agreements/%Y/%m/',
        null=True,
        blank=True
    )
    signed_agreement_file = models.FileField(
        upload_to='signed_agreements/%Y/%m/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Agreement for {self.student.username} at {self.organization.name}"

class InternshipPlan(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    internship = models.OneToOneField(
        'Internship',
        on_delete=models.CASCADE,
        related_name='plan'
    )
    content = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    feedback = models.TextField(blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='approved_plans'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Plan for {self.internship.student.username}'s internship"
