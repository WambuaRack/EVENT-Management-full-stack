from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def is_manager(self):
        return self.role in ('manager', 'admin')

    def is_admin(self):
        return self.role == 'admin'

    def __str__(self):
        return f"{self.username} ({self.role})"


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='events')
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return self.title


class RSVP(models.Model):
    STATUS_CHOICES = (
        ('going', 'Going'),
        ('maybe', 'Maybe'),
        ('not', 'Not Going'),
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='rsvps')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='going')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')

    def __str__(self):
        return f"{self.user.username} -> {self.event.title} ({self.status})"
