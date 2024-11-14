from django.contrib import admin
from .models import Organization, Department, News

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    ordering = ('-updated_at',)

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Contact Information', {
            'fields': ('contact_person', 'contact_email', 'contact_phone', 'address', 'website')
        }),
    )

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization', 'description')
    list_filter = ('organization',)
    search_fields = ('name', 'organization__name', 'description')
    ordering = ('organization', 'name')

    fieldsets = (
        (None, {
            'fields': ('name', 'organization', 'description', 'is_active')
        }),
    )

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'organization', 'is_published', 'created_at')
    list_filter = ('is_published', 'organization', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'author', 'organization', 'is_published')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.author:
            obj.author = request.user
        obj.save()
