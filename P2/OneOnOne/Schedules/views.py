from .models import Schedule
from .serializer import SchedulesSerializer, InviteeSerializer
from rest_framework import generics, permissions, status
from rest_framework.response import Response

# Create your views here.
class ScheduleCreateView(generics.CreateAPIView):
    """
    Summary:
        View To Create A Schedule

    Args:
        Method: POST
        'title', 'description', 'invitee', 'date'
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Schedule.objects.all()
    serializer_class = SchedulesSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ScheduleDetailView(generics.RetrieveAPIView):
    """
    Summary:
        View To See Details Of A Specific Schedule

    Args:
        Method: GET
        contact_id: Id of the contact the user would like to see details of  
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Schedule.objects.all()
    serializer_class = SchedulesSerializer

class ScheduleListView(generics.ListAPIView):
    """
    Summary:
        View To See All Schedules

    Args:
        Method: GET
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Schedule.objects.all()
    serializer_class = SchedulesSerializer

class ScheduleUpdateView(generics.UpdateAPIView):
    """
    Summary:
        View To Update Details Of A Schedule
        Only owner can edit
    Args:
        Method: PUT/PATCH
        'title', 'description', 'invitee', 'date',
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Schedule.objects.all()
    serializer_class = SchedulesSerializer

    def dispatch(self, request, *args, **kwargs):
        if request.user != Schedule.objects.get(id=kwargs['pk']).owner:
            return Response({'message': 'You do not have permission to edit this schedule.'}, status=403)
        return super().dispatch(request, *args, **kwargs)

class ScheduleDeleteView(generics.DestroyAPIView):
    """
    Summary:
        View To Delete Schedule
        Only owner can delete
    Args:
        Method: DELETE
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Schedule.objects.all()
    serializer_class = SchedulesSerializer

    def dispatch(self, request, *args, **kwargs):
        if request.user != Schedule.objects.get(id=kwargs['pk']).owner:
            return Response({'message': 'You do not have permission to delete this schedule.'}, status=403)
        return super().dispatch(request, *args, **kwargs)

class ScheduleInvitationAPIView(generics.RetrieveAPIView):
    """
    Summary:
        Allow invitee to accept or request new time for a schedule
        Only invitee can accept or request new time
    Args:
       Method: POST
       action: accept or request_new_time
       suggested_time: new time for the schedule
    """
    permissions_classes = [permissions.IsAuthenticated]
    queryset = Schedule.objects.all()
    serializer_class = InviteeSerializer

    def post(self, request, pk):
        if request.user != Schedule.objects.get(id=pk).invitee:
            return Response({'message': 'You do not have permission to finalize this schedule.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            action = request.data.get('action')
            schedule = Schedule.objects.get(id=pk)
            if action == 'accept':
                schedule.finalized = True
                schedule.save()
                message = f"'{schedule.title}' Finalized!"
                schedule.send_finalized_email()
                return Response({'message': message}, status=200)
            elif action == 'request_new_time':
                message = f"You have sent a request for a new time to {schedule.owner}!"
                suggested_time = request.data.get('suggested_time')
                schedule.send_request_email(suggested_time)
                return Response({'message': message}, status=200)
            else:
                return Response({'message': 'Invalid action'}, status=400)
