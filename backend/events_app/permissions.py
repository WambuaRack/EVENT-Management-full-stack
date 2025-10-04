from rest_framework import permissions

class IsAdminOrManager(permissions.BasePermission):
    """
    Allow access only to users with role 'manager' or 'admin'.
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and (user.role in ('manager','admin')))

class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or admin to edit it.
    Read-only allowed for safe methods.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # obj is Event
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return obj.created_by == user or user.role == 'admin'
