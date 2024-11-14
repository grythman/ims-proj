from django.contrib import admin
from .models import Internship, Task, Agreement, InternshipPlan, Evaluation, Report

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('get_internship', 'evaluator', 'evaluator_type', 'created_at')
    list_filter = ('evaluator_type', 'created_at')
    search_fields = ('evaluator__username', 'comments')
    ordering = ('-created_at',)

    def get_internship(self, obj):
        return obj.report.internship if obj.report else None
    get_internship.short_description = 'Internship'
    get_internship.admin_order_field = 'report__internship'

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'student', 'report_type', 'status', 'submitted_at')
    list_filter = ('report_type', 'status', 'submitted_at')
    search_fields = ('title', 'student__username', 'content')
    ordering = ('-submitted_at',)

@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ('student', 'mentor', 'organization', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'start_date', 'organization')
    search_fields = ('student__username', 'mentor__username', 'organization__name')
    ordering = ('-start_date',)
    
    fieldsets = (
        (None, {
            'fields': ('student', 'mentor', 'organization', 'status')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date')
        }),
        ('Details', {
            'fields': ('title', 'description')
        })
    )

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'internship', 'status', 'priority', 'due_date')
    list_filter = ('status', 'priority', 'due_date')
    search_fields = ('title', 'description', 'internship__student__username')
    ordering = ('due_date',)

@admin.register(Agreement)
class AgreementAdmin(admin.ModelAdmin):
    list_display = ('student', 'organization', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('student__username', 'organization__name')
    ordering = ('-created_at',)

@admin.register(InternshipPlan)
class InternshipPlanAdmin(admin.ModelAdmin):
    list_display = ('get_student', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('internship__student__username', 'content')
    ordering = ('-created_at',)

    def get_student(self, obj):
        return obj.internship.student if obj.internship else None
    get_student.short_description = 'Student'
    get_student.admin_order_field = 'internship__student'
