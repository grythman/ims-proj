from rest_framework import serializers
from django.utils import timezone
from .models import Internship, Task, Agreement, InternshipPlan, Evaluation, PreliminaryReport
from apps.users.serializers import UserSerializer
from apps.companies.serializers import OrganizationSerializer
from apps.reports.serializers import ReportSerializer

class EvaluationSerializer(serializers.ModelSerializer):
    evaluator_name = serializers.CharField(source='evaluator.get_full_name', read_only=True)
    evaluator_role = serializers.CharField(source='evaluator.user_type', read_only=True)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id', 'evaluator', 'evaluator_name', 'evaluator_role',
            'performance_rating', 'attendance_rating', 'initiative_rating',
            'teamwork_rating', 'technical_skills_rating', 'comments',
            'average_rating', 'created_at', 'updated_at'
        ]
        read_only_fields = ['evaluator']


class PreliminaryReportSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = PreliminaryReport
        fields = [
            'id', 'content', 'status', 'status_display',
            'feedback', 'reviewed_by', 'reviewer_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reviewed_by', 'status']

class TaskSerializer(serializers.ModelSerializer):
    assigned_by_name = serializers.CharField(source='assigned_by.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    days_remaining = serializers.SerializerMethodField()
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'assigned_by', 'assigned_by_name',
            'due_date', 'status', 'status_display', 'priority', 'priority_display',
            'hours_spent', 'feedback', 'attachments', 'attachment_url',
            'is_overdue', 'days_remaining', 'created_at', 'updated_at'
        ]
        read_only_fields = ['assigned_by']

    def get_days_remaining(self, obj):
        if obj.due_date:
            delta = obj.due_date - timezone.now().date()
            return delta.days
        return None

    def get_attachment_url(self, obj):
        if obj.attachments:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachments.url)
        return None

class InternshipSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    mentor = UserSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    progress = serializers.FloatField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    days_remaining = serializers.SerializerMethodField()
    task_stats = serializers.SerializerMethodField()
    mentor_evaluation = EvaluationSerializer(read_only=True)
    teacher_evaluation = EvaluationSerializer(read_only=True)
    preliminary_reports = PreliminaryReportSerializer(many=True, read_only=True)
    duration_in_weeks = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Internship
        fields = [
            'id', 'student', 'mentor', 'organization', 'department',
            'title', 'description', 'start_date', 'end_date', 'status',
            'status_display', 'hours_required', 'hours_completed',
            'progress', 'is_overdue', 'days_remaining', 'feedback',
            'tasks', 'task_stats', 'mentor_evaluation', 'teacher_evaluation',
            'preliminary_reports', 'duration_in_weeks', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['hours_completed']

    def get_days_remaining(self, obj):
        if obj.end_date:
            delta = obj.end_date - timezone.now().date()
            return delta.days
        return None

    def get_task_stats(self, obj):
        tasks = obj.tasks.all()
        total = tasks.count()
        if total == 0:
            return {
                'total': 0,
                'completed': 0,
                'pending': 0,
                'overdue': 0,
                'completion_rate': 0
            }

        completed = tasks.filter(status='completed').count()
        pending = tasks.filter(status='pending').count()
        overdue = sum(1 for task in tasks if task.is_overdue)

        return {
            'total': total,
            'completed': completed,
            'pending': pending,
            'overdue': overdue,
            'completion_rate': (completed / total) * 100
        }

    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError(
                    "End date must be after start date"
                )
            if data['start_date'] < timezone.now().date():
                raise serializers.ValidationError(
                    "Start date cannot be in the past"
                )
        return data

class InternshipCreateSerializer(InternshipSerializer):
    student_id = serializers.IntegerField(write_only=True)
    mentor_id = serializers.IntegerField(write_only=True)
    organization_id = serializers.IntegerField(write_only=True)

    class Meta(InternshipSerializer.Meta):
        fields = InternshipSerializer.Meta.fields + [
            'student_id', 'mentor_id', 'organization_id'
        ]

    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        mentor_id = validated_data.pop('mentor_id')
        organization_id = validated_data.pop('organization_id')

        validated_data['student_id'] = student_id
        validated_data['mentor_id'] = mentor_id
        validated_data['organization_id'] = organization_id

        return super().create(validated_data)

class AgreementSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    can_sign_student = serializers.SerializerMethodField()
    can_sign_organization = serializers.SerializerMethodField()
    can_sign_university = serializers.SerializerMethodField()
    agreement_file_url = serializers.SerializerMethodField()
    signed_agreement_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Agreement
        fields = [
            'id', 'internship', 'student', 'organization',
            'start_date', 'end_date', 'status', 'status_display',
            'student_signature', 'organization_signature',
            'university_signature', 'agreement_file',
            'signed_agreement_file', 'agreement_file_url',
            'signed_agreement_file_url', 'can_sign_student',
            'can_sign_organization', 'can_sign_university',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'student_signature', 'organization_signature',
            'university_signature', 'agreement_file',
            'signed_agreement_file'
        ]

    def get_can_sign_student(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return False
        return (
            request.user == obj.student and
            not obj.student_signature and
            obj.status != 'approved'
        )

    def get_can_sign_organization(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return False
        return (
            request.user.organization == obj.organization and
            not obj.organization_signature and
            obj.status != 'approved'
        )

    def get_can_sign_university(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return False
        return (
            request.user.has_perm('internships.can_sign_agreement') and
            not obj.university_signature and
            obj.status != 'approved'
        )

    def get_agreement_file_url(self, obj):
        if obj.agreement_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.agreement_file.url)
        return None

    def get_signed_agreement_file_url(self, obj):
        if obj.signed_agreement_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.signed_agreement_file.url)
        return None

class AgreementCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agreement
        fields = ['internship', 'organization', 'start_date', 'end_date']

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError(
                "End date must be after start date"
            )
        if data['start_date'] < timezone.now().date():
            raise serializers.ValidationError(
                "Start date cannot be in the past"
            )
        return data

class InternshipPlanSerializer(serializers.ModelSerializer):
    approved_by = UserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    can_review = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()

    class Meta:
        model = InternshipPlan
        fields = [
            'id', 'internship', 'content', 'status',
            'status_display', 'feedback', 'approved_by',
            'can_review', 'can_edit', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['approved_by']

    def get_can_review(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return False
        return (
            request.user == obj.internship.mentor or
            request.user.has_perm('internships.can_review_plan')
        )

    def get_can_edit(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return False
        return (
            request.user == obj.internship.student and
            obj.status in ['draft', 'rejected']
        )

    def validate(self, data):
        if self.instance and self.instance.status not in ['draft', 'rejected']:
            raise serializers.ValidationError(
                "Can only edit draft or rejected plans"
            )
        return data




class InternshipRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship
        fields = [
            'organization', 'title', 'description',
            'start_date', 'end_date'
        ]

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError(
                "End date must be after start date"
            )
        return data

class TeacherReportReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='internship.student.get_full_name', read_only=True)
    submission_date = serializers.DateTimeField(read_only=True)
    report_type = serializers.CharField(read_only=True)
    report_content = serializers.CharField(source='content', read_only=True)

    class Meta:
        model = PreliminaryReport
        fields = [
            'id', 'student_name', 'submission_date', 'report_type',
            'report_content', 'status', 'feedback', 'reviewed_by',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reviewed_by']

class StudentProgressSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    reports = ReportSerializer(many=True, read_only=True)
    evaluations = EvaluationSerializer(many=True, read_only=True)
    completion_percentage = serializers.SerializerMethodField()
    attendance_rate = serializers.SerializerMethodField()
    overall_performance = serializers.SerializerMethodField()

    class Meta:
        model = Internship
        fields = [
            'id', 'student', 'reports', 'evaluations',
            'completion_percentage', 'attendance_rate',
            'overall_performance', 'status', 'created_at'
        ]

    def get_completion_percentage(self, obj):
        total_reports = obj.reports.count()
        if total_reports == 0:
            return 0
        completed_reports = obj.reports.filter(status='approved').count()
        return (completed_reports / total_reports) * 100

    def get_attendance_rate(self, obj):
        if obj.mentor_evaluation:
            return obj.mentor_evaluation.attendance_rating * 20  # Convert 1-5 to percentage
        return None

    def get_overall_performance(self, obj):
        if not (obj.mentor_evaluation and obj.teacher_evaluation):
            return None
        
        mentor_avg = obj.mentor_evaluation.average_rating
        teacher_avg = obj.teacher_evaluation.average_rating
        return (mentor_avg + teacher_avg) / 2

class FinalEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = [
            'performance_rating', 'attendance_rating',
            'initiative_rating', 'teamwork_rating',
            'technical_skills_rating', 'comments'
        ]

    def create(self, validated_data):
        validated_data['evaluator'] = self.context['request'].user
        return super().create(validated_data)

class TeacherDashboardSerializer(serializers.Serializer):
    total_internships = serializers.IntegerField()
    active_internships = serializers.IntegerField()
    pending_reports = serializers.IntegerField()
    average_ratings = serializers.DictField()