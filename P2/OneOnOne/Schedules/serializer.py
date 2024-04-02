from rest_framework import serializers
from .models import Calendar, Availability, Invitee, Event, Priority
from django.contrib.auth.models import User
from Contacts.models import Contact
import uuid

class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = ['availability', 'priority']

class InviteeSerializer(serializers.ModelSerializer):
    selected_availability = PrioritySerializer(many=True)

    class Meta:
        model = Invitee
        fields = ['calendar', 'contact', 'random_link_token', 'selected_availability']

    def create(self, validated_data):
        validated_data['random_link_token'] = uuid.uuid4()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        selected_availability_data = validated_data.pop('selected_availability', [])
        instance = super().update(instance, validated_data)
        # Update or create selected availabilities
        for priority_data in selected_availability_data:
            availability_id = priority_data.get('availability').id
            priority = priority_data.get('priority')
            priority, _ = Priority.objects.update_or_create(
                invitee=instance,
                availability_id=availability_id,
                defaults={'priority': priority}
            )
        return instance

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
