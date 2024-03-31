from django.urls import path
from .views import CalendarViewSet, InviteeListView, InviteeDetailView, InviteeOptionsView, EventListView, EventDetailView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'calendars', CalendarViewSet, basename='calendar')

urlpatterns = [
    path('calendars/<int:calendar_id>/invitees/', InviteeListView.as_view(), name='invitee-list'),
    path('calendars/<int:calendar_id>/invitees/<int:invitee_id>/', InviteeDetailView.as_view(), name='invitee-detail'),
    path('invitee/<random_link_token>/', InviteeOptionsView.as_view(), name='invitee-control'),
    path('calendars/<int:calendar_id>/events/', EventListView.as_view(), name='event-list'),
    path('calendars/<int:calendar_id>/events/<int:event_id>/', EventDetailView.as_view(), name='event-detail')
]

urlpatterns += router.urls
