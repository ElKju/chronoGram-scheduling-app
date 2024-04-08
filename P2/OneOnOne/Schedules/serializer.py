from rest_framework import serializers
from .models import Calendar, Availability, Invitee, Priority, SuggestedEvent, SuggestedSchedule
from django.contrib.auth.models import User
from Contacts.models import Contact
import uuid

class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = ['availability', 'priority']

class InviteeSerializer(serializers.ModelSerializer):
    selected_availability = PrioritySerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set required=False for all fields except 'contact'
        for field_name in self.fields.keys():
            if field_name != 'contact':
                self.fields[field_name].required = False

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
        fields = ['id', 'title', 'owner', 'description', 'duration', 'availability_set', 'invitees', 'finalized']

    def create(self, validated_data):
        availability_data = validated_data.pop('availability_set', [])
        invitees_data = validated_data.pop('invitees', [])

        calendar = Calendar.objects.create(**validated_data)

        for availability in availability_data:
            Availability.objects.create(calendar=calendar, **availability)

        for invitee_data in invitees_data:
            Invitee.objects.create(calendar=calendar, **invitee_data)

        return calendar
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.owner = validated_data.get('owner', instance.owner)
        instance.description = validated_data.get('description', instance.description)
        instance.duration = validated_data.get('duration', instance.duration)

        # Delete all existing availabilities and invitees
        instance.availability_set.all().delete()
        instance.invitees.all().delete()

        # Create new availabilities
        availability_data = validated_data.get('availability_set', [])
        for availability_item in availability_data:
            Availability.objects.create(calendar=instance, **availability_item)

        # Create new invitees
        invitees_data = validated_data.get('invitees', [])
        for invitee_item in invitees_data:
            Invitee.objects.create(calendar=instance, **invitee_item)

        instance.save()
        return instance

class SuggestedEventSerializer(serializers.ModelSerializer):
    invitee_details = serializers.SerializerMethodField()
    availability_details = serializers.SerializerMethodField()
    class Meta:
        model = SuggestedEvent
        fields = ['id', 'availability', 'invitee', 'invitee_details', 'availability_details']
    
    def get_invitee_details(self, obj):
        invitee_data = {
            'contact': obj.invitee.contact.pk,
            'first_name': obj.invitee.contact.first_name,
            'last_name': obj.invitee.contact.last_name
        }
        return invitee_data
    
    def get_availability_details(self, obj):
        availability_data = {
            'start_time': obj.availability.start_time,
            'end_time': obj.availability.end_time
        }
        return availability_data

class SuggestedScheduleSerializer(serializers.ModelSerializer):
    events = SuggestedEventSerializer(many=True)

    class Meta:
        model = SuggestedSchedule
        fields = ['id', 'calendar', 'preference', 'events']

    def create(self, validated_data):
        events_data = validated_data.pop('events', [])  # Ensure events_data is a list
        suggested_schedule = SuggestedSchedule.objects.create(**validated_data)
        for event_data in events_data:
            SuggestedEvent.objects.create(suggested_schedule=suggested_schedule, **event_data)
        return suggested_schedule
