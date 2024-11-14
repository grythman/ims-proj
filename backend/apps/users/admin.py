from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, NotificationPreference, Activity

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'get_organization', 'is_active')
    list_filter = ('user_type', 'is_active', 'organization', 'department')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'student_id', 'faculty_id')
    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {
            'fields': (
                'first_name', 'last_name', 'email', 'phone',
                'avatar', 'bio', 'skills'
            )
        }),
        ('Role Information', {
            'fields': (
                'user_type', 'organization', 'department',
                'student_id', 'major', 'year_of_study',
                'company', 'position', 'expertise',
                'department_name', 'faculty_id', 'subject_area'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            ),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    def get_organization(self, obj):
        return obj.organization.name if obj.organization else '-'
    get_organization.short_description = 'Organization'

@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notifications', 'push_notifications')
    list_filter = ('email_notifications', 'push_notifications')
    search_fields = ('user__username', 'user__email')

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'created_at', 'ip_address')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user__username', 'description')
    ordering = ('-created_at',)
