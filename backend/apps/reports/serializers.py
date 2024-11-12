from rest_framework import serializers
from django.utils import timezone
from .models import Report, ReportComment, ReportTemplate
from apps.users.serializers import UserSerializer

class ReportCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    attachment_url = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = ReportComment
        fields = [
            'id', 'author', 'content', 'attachment',
            'attachment_url', 'created_at', 'time_ago'
        ]
        read_only_fields = ['author']

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
        return None

    def get_time_ago(self, obj):
        now = timezone.now()
        diff = now - obj.created_at

        if diff.days > 30:
            months = diff.days // 30
            return f"{months} month{'s' if months != 1 else ''} ago"
        elif diff.days > 0:
            return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        else:
            return "just now"

class ReportTemplateSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)

    class Meta:
        model = ReportTemplate
        fields = [
            'id', 'name', 'description', 'content_template',
            'report_type', 'report_type_display', 'is_active',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by']

class ReportSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    mentor = UserSerializer(read_only=True)
    comments = ReportCommentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    file_url = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    can_review = serializers.SerializerMethodField()
    review_time = serializers.SerializerMethodField()
    submission_time = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id', 'title', 'content', 'student', 'mentor',
            'internship', 'type', 'type_display', 'status',
            'status_display', 'feedback', 'file', 'file_url',
            'submission_date', 'review_date', 'comments',
            'can_edit', 'can_review', 'review_time',
            'submission_time', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'student', 'mentor', 'submission_date',
            'review_date', 'status'
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None

    def get_can_edit(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return False
        return (
            request.user == obj.student and 
            obj.status in ['draft', 'revised']
        )

    def get_can_review(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return False
        return (
            request.user == obj.mentor or
            request.user.has_perm('reports.can_review_reports')
        )

    def get_review_time(self, obj):
        if obj.review_date:
            return obj.review_date.strftime('%Y-%m-%d %H:%M:%S')
        return None

    def get_submission_time(self, obj):
        if obj.submission_date:
            return obj.submission_date.strftime('%Y-%m-%d %H:%M:%S')
        return None

    def validate(self, data):
        if self.instance and self.instance.status not in ['draft', 'revised']:
            raise serializers.ValidationError(
                "Can only edit draft or revised reports"
            )
        return data