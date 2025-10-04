from rest_framework import serializers
from .models import CustomUser, Event, RSVP

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        # Use default role if not provided
        role = validated_data.get('role', 'user')
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=role
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role
        token['username'] = user.username
        return token


class EventSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'


class RSVPSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = RSVP
        fields = '__all__'
