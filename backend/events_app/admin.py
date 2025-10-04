from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Event, RSVP

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Show role in the list view
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    
    # Add role to fieldsets in user detail/edit view
    fieldsets = UserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )
    
    # Allow role to be editable in the add user form
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_time', 'end_time', 'location', 'created_by', 'is_public', 'created_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('title', 'location', 'description')

@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
