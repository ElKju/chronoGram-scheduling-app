from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Calendar, Invitee, Availability, Priority, SuggestedSchedule, SuggestedEvent
from .serializer import CalendarSerializer, InviteeSerializer, AvailabilitySerializer, SuggestedScheduleSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
import random

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
                    f"You have been invited to {invitee.calendar.title} by {invitee.calendar.owner.username}.\n Please go to http://127.0.0.1:3000/invitee/{invitee.random_link_token} to rsvp",
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
                    f"You have been invited to {invitee.calendar.title} by {invitee.calendar.owner.username}.\n Please go to http://127.0.0.1:3000/invitee/{invitee.random_link_token} to rsvp with the most recent timeslots",
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
            # Check if all other invitees have already provided an availability
            if all(invitee.selected_availability.exists() for invitee in invitee.calendar.invitees.exclude(pk=invitee.pk)):
                # Send email to owner that all invitees have responded
                send_mail(
                    f"All invitees have responded to {invitee.calendar.title}",
                    f"All invitees have responded to {invitee.calendar.title}. Please go to http://127.0.0.1:3000/schedules/{invitee.calendar.pk}/select/",
                    settings.EMAIL_HOST_USER,
                    [invitee.calendar.owner.email],
                    fail_silently=False
                )
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ScheduleSuggestView(APIView):
    def post(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(pk=calendar_id)
        except Calendar.DoesNotExist:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # If suggested schedules exist for this calendar, delete them
        SuggestedSchedule.objects.filter(calendar=calendar).delete()

        # get availabilities
        availabilities = Availability.objects.filter(calendar=calendar)
        invitees = Invitee.objects.filter(calendar=calendar)

        slots = {}
        for availability in availabilities:
            slots[availability.pk] = 2

        # get invitees and priorities
        inv = {}
        for invitee in invitees:
            for availability in availabilities:
                priority = Priority.objects.filter(invitee=invitee, availability=availability)
                if priority:
                    priority_value = priority[0].priority
                else: 
                    priority_value = 0

                if invitee.contact.first_name in inv:
                    inv[invitee.pk].append(priority_value)
                else:
                    inv[invitee.pk] = [priority_value]

        suggested_scheudules = self.suggestion_algo(inv, slots, 3)

        if len(suggested_scheudules) == 0:
            return Response({"error": "No valid schedules found."}, status=status.HTTP_400_BAD_REQUEST)

        suggested_scheudules_data = []
        for suggested_events, preference in suggested_scheudules:
            print(suggested_events)
            print(preference)
            suggested_scheudule_data = {
                'calendar': calendar_id,
                'preference': preference,
                'events': []
            }
            for invitee, availability in suggested_events.items():
                suggested_scheudule_data['events'].append({
                    'invitee': invitee,
                    'availability': availability
                })
            suggested_scheudules_data.append(suggested_scheudule_data)

        serializer = SuggestedScheduleSerializer(data=suggested_scheudules_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(pk=calendar_id)
        except Calendar.DoesNotExist:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)

        schedules = SuggestedSchedule.objects.filter(calendar=calendar)
        serializer = SuggestedScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    def suggest_schedule(self, invitees_dict, slots):
        slots_names = list(slots.keys())
        slots_weights = list(slots.values())
        suggestion_lst = []
        weight_lst = []

        # sort invitees from smallest indv slot weight to highest indv slot weight
        sorted_invitees = sorted(invitees_dict, key=lambda invitee: sum(invitees_dict[invitee]))

        while len(suggestion_lst) < 10:
            suggestion = {}
            used_slot = []
            total_weight = 0
            for invitee in sorted_invitees:
                slots_index = list(range(len(slots_weights)))
                random.shuffle(slots_index)
                assigned_slot = -1
                for i  in slots_index:
                    weight_i = invitees_dict[invitee][i] + slots_weights[i]
                    if invitees_dict[invitee][i] != 0 and (i not in used_slot):
                        assigned_slot = i
                if assigned_slot == -1:
                    break
                suggestion[invitee] = slots_names[assigned_slot]
                used_slot.append(assigned_slot)
                total_weight += invitees_dict[invitee][assigned_slot] + slots_weights[assigned_slot]
            suggestion_lst.append(suggestion)
            weight_lst.append(total_weight)

        return suggestion_lst, weight_lst

    def valid_schedules(self, suggestion_lst, weight_lst, num_invitee):
        valid_suggestion_lst = []
        valid_weight_lst =  []
        for i in range(len(suggestion_lst)):
            if len(suggestion_lst[i]) == num_invitee:
                valid_suggestion_lst.append(suggestion_lst[i])
                valid_weight_lst.append(weight_lst[i])
        combined_lst = list(zip(valid_suggestion_lst, valid_weight_lst))
        unique_dicts = set()
        unique_lst = [(d, t) for d, t in combined_lst if (d_tuple := tuple(sorted(d.items()))) not in unique_dicts and not unique_dicts.add(d_tuple)]
        return unique_lst

    def suggestion_algo(self, invitees_dict, slots, desired_num):
        suggestion_lst, weight_lst = self.suggest_schedule(invitees_dict, slots)
        unique_lst = self.valid_schedules(suggestion_lst, weight_lst, len(invitees_dict))

        return unique_lst

class SelectSuggestView(APIView):
    def put(self, request, calendar_id, schedule_id):
        try:
            calendar = Calendar.objects.get(pk=calendar_id)
            schedule = SuggestedSchedule.objects.get(pk=schedule_id, calendar=calendar)
        except:
            return Response({"error": "Calendar or schedule not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all the schedules for the calendar
        schedules = SuggestedSchedule.objects.filter(calendar=calendar)

        # Delete all the schedules except the selected one
        for schedule in schedules:
            if schedule.pk != schedule_id:
                schedule.delete()

        # Update the calendar to be finalized
        calendar.finalized = True
        calendar.save()

        # Let invitees know they have been booked for a specific time slot
        for invitee in Invitee.objects.filter(calendar=calendar):
            event = SuggestedEvent.objects.get(invitee=invitee)
            send_mail(
                f"Your meeting time for {invitee.calendar.title} has been booked!",
                f"You are scheduled to meet with {calendar.owner.username} on {event.availability.start_time.strftime('%Y-%m-%d at %H:%M')}-{event.availability.end_time.strftime('%H:%M')}.",
                settings.EMAIL_HOST_USER,
                [invitee.contact.email_address],
                fail_silently=False
            )

        return Response({"message": "Suggested schedule selected successfully"}, status=status.HTTP_200_OK)
