from django.urls import path
from .views import ScheduleCreateView, ScheduleDetailView, ScheduleListView, ScheduleDeleteView, ScheduleUpdateView, ScheduleInvitationAPIView


app_name = 'Schedules'

urlpatterns = [
    path('schedules/create/', ScheduleCreateView.as_view(), name='schedule-create'),
    path('schedules/<int:pk>/details/', ScheduleDetailView.as_view(), name='schedule-detail'),
    path('schedules/<int:pk>/edit/', ScheduleUpdateView.as_view(), name='schedule-edit'),
    path('schedules/<int:pk>/delete/', ScheduleDeleteView.as_view(), name='schedule-delete'),
    path('schedules/list/all/', ScheduleListView.as_view(), name='schedule-list'),
    path('schedules/<int:pk>/rsvp/', ScheduleInvitationAPIView.as_view(), name='schedule-invitee-rsvp'),
]