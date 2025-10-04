from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, RSVPViewSet, UserRegisterViewSet, UserListView, UserDetailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'rsvps', RSVPViewSet, basename='rsvp')
router.register(r'auth/register', UserRegisterViewSet, basename='register')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Admin-only user endpoints
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
