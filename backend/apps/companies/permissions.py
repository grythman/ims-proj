from rest_framework import permissions

class IsOrganizationAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_staff or 
            request.user.user_type in ['admin', 'teacher']
        )

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or request.user.user_type in ['admin', 'teacher'] 