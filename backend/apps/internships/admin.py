from django.contrib import admin
from .models import Internship, Report, Evaluation

@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ('title', 'student', 'organization', 'status', 'start_date')
    list_filter = ('status', 'organization', 'start_date')
    search_fields = ('title', 'student__username', 'organization__name')
    date_hierarchy = 'start_date'
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'internship', 'type', 'status', 'created_at')
    list_filter = ('type', 'status')
    search_fields = ('title', 'internship__title')

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('report', 'evaluator', 'evaluator_type', 'score')
    list_filter = ('evaluator_type', 'is_final')
