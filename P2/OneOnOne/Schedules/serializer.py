from rest_framework import serializers, viewsets

from .models import Schedule

class SchedulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['title', 'description', 'invitee', 'date']

class InviteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['action']
