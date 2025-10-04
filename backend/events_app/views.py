from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import models
from .models import CustomUser, Event, RSVP
from .serializers import UserSerializer, EventSerializer, RSVPSerializer
from rest_framework.permissions import AllowAny


# Registration
class UserRegisterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # anyone can register


# Events
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().select_related('created_by').prefetch_related('rsvps')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Event.objects.filter(is_public=True)
        if user.role in ('manager', 'admin'):
            return Event.objects.all()
        return Event.objects.filter(models.Q(is_public=True) | models.Q(created_by=user))

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_public(self, request, pk=None):
        event = self.get_object()
        if event.created_by != request.user and request.user.role != 'admin':
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        event.is_public = not event.is_public
        event.save()
        return Response({'is_public': event.is_public})


# RSVP
class RSVPViewSet(viewsets.ModelViewSet):
    queryset = RSVP.objects.all().select_related('user', 'event')
    serializer_class = RSVPSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('manager', 'admin'):
            return RSVP.objects.all()
        return RSVP.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser

User = get_user_model()

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]