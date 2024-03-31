from rest_framework import serializers
from .models import Calendar, Availability, Invitee, Event
from django.contrib.auth.models import User
from Contacts.models import Contact
import uuid

class InviteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitee
        fields = ['contact', 'selected_availability', 'random_link_token']

    def create(self, validated_data):
        validated_data['random_link_token'] = uuid.uuid4()
        return super().create(validated_data)

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'start_time', 'end_time']

class CalendarSerializer(serializers.ModelSerializer):
    availability_set = AvailabilitySerializer(many=True, required=True)
    invitees = InviteeSerializer(many=True, required=True)

    class Meta:
        model = Calendar
        fields = ['title', 'owner', 'description', 'duration', 'availability_set', 'invitees']

    def create(self, validated_data):
        availability_data = validated_data.pop('availability_set', [])
        invitees_data = validated_data.pop('invitees', [])

        calendar = Calendar.objects.create(**validated_data)

        for availability in availability_data:
            Availability.objects.create(calendar=calendar, **availability)

        for invitee_data in invitees_data:
            Invitee.objects.create(calendar=calendar, **invitee_data)

        return calendar

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'calendar', 'invitee', 'timeslot']