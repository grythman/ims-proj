from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError
from .models import Report, ReportTemplate
from .serializers import (
    ReportSerializer, 
    ReportTemplateSerializer,
    ReportCommentSerializer
)
from .permissions import IsReportParticipant, CanReviewReports
from apps.notifications.services import NotificationService

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsReportParticipant]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'type', 'internship']
    search_fields = ['title', 'content']
    ordering_fields = ['submission_date', 'created_at']

    def get_queryset(self):
        queryset = Report.objects.select_related(
            'student', 'mentor', 'internship'
        ).prefetch_related(
            'comments', 'comments__author'
        )

        user = self.request.user
        if user.user_type == 'student':
            return queryset.filter(student=user)
        elif user.user_type == 'mentor':
            return queryset.filter(mentor=user)
        return queryset

    def perform_create(self, serializer):
        internship = serializer.validated_data['internship']
        report = serializer.save(
            student=self.request.user,
            mentor=internship.mentor
        )

        if report.status == 'pending':
            # Notify mentor
            if report.mentor:
                NotificationService.create_notification(
                    recipient=report.mentor,
                    title='New Report Submitted',
                    message=f'{report.student.get_full_name()} submitted a new report: {report.title}',
                    notification_type='report'
                )

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        report = self.get_object()
        
        if report.status != 'draft':
            return Response(
                {'error': 'Only draft reports can be submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )

        report.submit()

        # Notify mentor
        if report.mentor:
            NotificationService.create_notification(
                recipient=report.mentor,
                title='Report Submitted for Review',
                message=f'{report.student.get_full_name()} submitted report: {report.title}',
                notification_type='report'
            )

        serializer = self.get_serializer(report)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def review(self, request, pk=None):
        report = self.get_object()
        
        if not request.user.has_perm('reports.can_review_reports'):
            return Response(
                {'error': 'You do not have permission to review reports'},
                status=status.HTTP_403_FORBIDDEN
            )

        status_choice = request.data.get('status')
        feedback = request.data.get('feedback')

        try:
            report.review(status_choice, feedback)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Notify student
        NotificationService.create_notification(
            recipient=report.student,
            title='Report Reviewed',
            message=f'Your report "{report.title}" has been {status_choice}',
            notification_type='report'
        )

        serializer = self.get_serializer(report)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def add_comment(self, request, pk=None):
        report = self.get_object()
        serializer = ReportCommentSerializer(data=request.data)
        
        if serializer.is_valid():
            comment = serializer.save(
                report=report,
                author=request.user
            )

            # Notify relevant users
            recipients = {report.student, report.mentor} - {request.user}
            for recipient in recipients:
                if recipient:
                    NotificationService.create_notification(
                        recipient=recipient,
                        title='New Comment on Report',
                        message=f'New comment on report: {report.title}',
                        notification_type='report_comment'
                    )

            return Response(
                ReportCommentSerializer(comment).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReportTemplateViewSet(viewsets.ModelViewSet):
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer
    permission_classes = [permissions.IsAuthenticated, CanReviewReports]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['report_type', 'is_active']
    search_fields = ['name', 'description']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)