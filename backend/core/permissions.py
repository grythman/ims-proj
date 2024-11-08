from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'ADMIN'

class IsStudentUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'STUDENT'

class IsCompanyRepresentative(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'COMPANY_REP'

class IsSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'SUPERVISOR' 