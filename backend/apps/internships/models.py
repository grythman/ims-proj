from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

# Create your models here.

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
    organization = models.ForeignKey(
        'companies.Organization',
        on_delete=models.CASCADE,
        related_name='internship_programs'
    )
    department = models.ForeignKey(
        'companies.Department',
        on_delete=models.SET_NULL,
        null=True,
        related_name='internships'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    hours_required = models.IntegerField(default=0)
    hours_completed = models.IntegerField(default=0)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mentor_evaluation = models.OneToOneField(
        'Evaluation',
        on_delete=models.SET_NULL,
        null=True,
        related_name='mentor_evaluation'
    )
    teacher_evaluation = models.OneToOneField(
        'Evaluation',
        on_delete=models.SET_NULL,
        null=True,
        related_name='teacher_evaluation'
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['mentor', 'status']),
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.student.username}'s internship at {self.organization.name}"

    def clean(self):
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValidationError("End date must be after start date")
        if self.hours_completed > self.hours_required:
            raise ValidationError("Completed hours cannot exceed required hours")

    @property
    def progress(self):
        if self.hours_required > 0:
            return (self.hours_completed / self.hours_required) * 100
        return 0

    @property
    def is_overdue(self):
        return self.status == 'active' and self.end_date < timezone.now().date()

    @property
    def duration_in_weeks(self):
        return (self.end_date - self.start_date).days // 7

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
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    priority = models.CharField(
        max_length=10, 
        choices=PRIORITY_CHOICES, 
        default='medium'
    )
    hours_spent = models.IntegerField(default=0)
    feedback = models.TextField(blank=True)
    attachments = models.FileField(
        upload_to='task_attachments/%Y/%m/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['due_date', '-priority']
        indexes = [
            models.Index(fields=['internship', 'status']),
            models.Index(fields=['due_date', 'priority']),
            models.Index(fields=['assigned_by', '-created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.internship.student.username}"

    @property
    def is_overdue(self):
        return self.status in ['pending', 'in_progress'] and self.due_date < timezone.now().date()

    def clean(self):
        if self.due_date and self.due_date < timezone.now().date():
            raise ValidationError("Due date cannot be in the past")

class Report(models.Model):
    REPORT_TYPES = (
        ('preliminary', 'Preliminary'),
        ('progress', 'Progress'),
        ('final', 'Final'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    internship = models.ForeignKey(
        'Internship',
        on_delete=models.CASCADE,
        related_name='internship_reports'
    )
    type = models.CharField(max_length=20, choices=REPORT_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    file = models.FileField(upload_to='reports/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Evaluation(models.Model):
    EVALUATOR_TYPES = (
        ('mentor', 'Mentor'),
        ('teacher', 'Teacher'),
    )
    
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    evaluator_type = models.CharField(max_length=10, choices=EVALUATOR_TYPES)
    
    score = models.IntegerField(null=True, blank=True)
    comments = models.TextField()
    is_final = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['student', 'organization']),
        ]

    def __str__(self):
        return f"Agreement for {self.student.username} at {self.organization.name}"

    def generate_agreement_file(self):
        # Generate PDF agreement using template
        from .services import AgreementService
        return AgreementService.generate_agreement_pdf(self)

    def sign(self, user_type):
        if user_type == 'student':
            self.student_signature = True
        elif user_type == 'organization':
            self.organization_signature = True
        elif user_type == 'university':
            self.university_signature = True

        # Check if all parties have signed
        if all([
            self.student_signature,
            self.organization_signature,
            self.university_signature
        ]):
            self.status = 'approved'
            # Generate final signed agreement
            self.signed_agreement_file = self.generate_agreement_file()
        
        self.save()

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

class Evaluation(models.Model):
    RATING_CHOICES = (
        (1, 'Poor'),
        (2, 'Fair'),
        (3, 'Good'),
        (4, 'Very Good'),
        (5, 'Excellent'),
    )

    evaluator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='given_evaluations'
    )
    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name='evaluations'
    )
    performance_rating = models.IntegerField(choices=RATING_CHOICES)
    attendance_rating = models.IntegerField(choices=RATING_CHOICES)
    initiative_rating = models.IntegerField(choices=RATING_CHOICES)
    teamwork_rating = models.IntegerField(choices=RATING_CHOICES)
    technical_skills_rating = models.IntegerField(choices=RATING_CHOICES)
    comments = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Evaluation by {self.evaluator.username} for {self.internship}"

    @property
    def average_rating(self):
        ratings = [
            self.performance_rating,
            self.attendance_rating,
            self.initiative_rating,
            self.teamwork_rating,
            self.technical_skills_rating
        ]
        return sum(ratings) / len(ratings)

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
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
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
