from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Calendar, Invitee, Availability, Event, Priority
from .serializer import CalendarSerializer, InviteeSerializer, AvailabilitySerializer, EventSerializer, PrioritySerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings

class CalendarViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Calendar.objects.filter(owner=request.user)
        serializer = CalendarSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            calendar = Calendar.objects.get(pk=pk)
        except Calendar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = CalendarSerializer(calendar)
        return Response(serializer.data)

    def create(self, request):
        request.data['owner'] = request.user.pk

        serializer = CalendarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            for invitee in Invitee.objects.filter(calendar__pk=serializer.data["id"]):
                send_mail(
                    f"Invitation to {invitee.calendar.title}",
                    f"You have been invited to {invitee.calendar.title} by {invitee.calendar.owner.first_name}.\n Please go to http://127.0.0.1:8000/invitee/{invitee.random_link_token} to rsvp",
                    settings.EMAIL_HOST_USER,
                    [invitee.contact.email_address],
                    fail_silently=False
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            calendar = Calendar.objects.get(pk=pk)
        except Calendar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if calendar.owner != request.user:
            return Response({"error": "You do not have permission to update this calendar."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CalendarSerializer(calendar, data=request.data)
        if serializer.is_valid():
            serializer.save()
            for invitee in Invitee.objects.filter(calendar__pk=serializer.data["id"]):
                send_mail(
                    f"Invitation to {invitee.calendar.title} has been updated",
                    f"You have been invited to {invitee.calendar.title} by {invitee.calendar.owner.first_name}.\n Please go to http://127.0.0.1:8000/invitee/{invitee.random_link_token} to rsvp with the most recent timeslots",
                    settings.EMAIL_HOST_USER,
                    [invitee.contact.email_address],
                    fail_silently=False
                )
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            calendar = Calendar.objects.get(pk=pk)
        except Calendar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if calendar.owner != request.user:
            return Response({"error": "You do not have permission to delete this calendar."}, status=status.HTTP_403_FORBIDDEN)
        
        calendar.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InviteeListView(APIView):
    def get(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(pk=calendar_id)
        except Calendar.DoesNotExist:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        
        invitees = calendar.invitees.all()
        serializer = InviteeSerializer(invitees, many=True)
        return Response(serializer.data)

    def post(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(pk=calendar_id)
        except Calendar.DoesNotExist:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if calendar.owner != request.user:
            return Response({"error": "You do not have permission to add invitees to this calendar."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = InviteeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(calendar=calendar, contact_id=request.data['contact'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InviteeDetailView(APIView):
    def get(self, request, calendar_id, invitee_id):
        try:
            invitee = Invitee.objects.get(pk=invitee_id, calendar__pk=calendar_id)
        except Invitee.DoesNotExist:
            return Response({"error": "Invitee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = InviteeSerializer(invitee)
        return Response(serializer.data)

    def put(self, request, calendar_id, invitee_id):
        try:
            invitee = Invitee.objects.get(pk=invitee_id, calendar__pk=calendar_id)
        except Invitee.DoesNotExist:
            return Response({"error": "Invitee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if invitee.calendar.owner != request.user:
            return Response({"error": "You do not have permission to update this invitee."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = InviteeSerializer(invitee, data=request.data)
        
        for availability in request.data.get('selected_availability', []):
            if Availability.objects.get(pk=availability).calendar != calendar_id:
                return Response({"error": f"Selected availability (id={availability}) does not belong to the specified calendar"}, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, calendar_id, invitee_id):
        try:
            invitee = Invitee.objects.get(pk=invitee_id, calendar__pk=calendar_id)
        except Invitee.DoesNotExist:
            return Response({"error": "Invitee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if invitee.calendar.owner != request.user:
            return Response({"error": "You do not have permission to delete this invitee."}, status=status.HTTP_403_FORBIDDEN)
        
        invitee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InviteeOptionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, random_link_token):
        try:
            invitee = Invitee.objects.get(random_link_token=random_link_token)
        except Invitee.DoesNotExist:
            return Response({"error": "Invitee token not found"}, status=status.HTTP_404_NOT_FOUND)
        
        calendar = invitee.calendar
        available_times = Availability.objects.filter(calendar=calendar)

        serializer = AvailabilitySerializer(available_times, many=True)
        return Response(serializer.data)
    
    def put(self, request, random_link_token):
        try:
            invitee = Invitee.objects.get(random_link_token=random_link_token)
        except Invitee.DoesNotExist:
            return Response({"error": "Invitee token not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = InviteeSerializer(invitee, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventListView(APIView):
    def get(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(pk=calendar_id)
        except Calendar.DoesNotExist:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        
        events = Event.objects.filter(calendar=calendar)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(pk=calendar_id)
        except Calendar.DoesNotExist:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if calendar.owner != request.user:
            return Response({"error": "You do not have permission to create events in this calendar."}, status=status.HTTP_403_FORBIDDEN)
        
        # Check that the selected availability belongs to the specified calendar
        timeslot = request.data["timeslot"]
        invitee = request.data["invitee"]
        if Availability.objects.get(pk=timeslot).calendar != calendar:
            return Response({"error": f"Selected availability (id={timeslot}) does not belong to the specified calendar  (id={calendar})"}, status=status.HTTP_400_BAD_REQUEST)
        # Check that the invitee is part of the specified calendar
        if not Invitee.objects.filter(pk=invitee, calendar=calendar).exists():
            return Response({"error": f"Invitee (id={invitee}) does not belong to the specified calendar (id={calendar})"}, status=status.HTTP_400_BAD_REQUEST)
        
        request.data["calendar"] = calendar_id
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(calendar=calendar)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventDetailView(APIView):
    def get(self, request, calendar_id, event_id):
        try:
            event = Event.objects.get(pk=event_id, calendar__pk=calendar_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EventSerializer(event)
        return Response(serializer.data)

    def put(self, request, calendar_id, event_id):
        try:
            event = Event.objects.get(pk=event_id, calendar__pk=calendar_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if event.calendar.owner != request.user:
            return Response({"error": "You do not have permission to edit this event."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, calendar_id, event_id):
        try:
            event = Event.objects.get(pk=event_id, calendar__pk=calendar_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if event.calendar.owner != request.user:
            return Response({"error": "You do not have permission to delete this event."}, status=status.HTTP_403_FORBIDDEN)
        
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
