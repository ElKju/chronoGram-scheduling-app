from django.db import models
from django.contrib.auth.models import User
from django.core.mail import send_mail
from datetime import timedelta
from django.conf import settings
from Contacts.models import Contact
import uuid

class Calendar(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.DurationField()

    def __str__(self):
        return self.title

class Availability(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.calendar.title}: {str(self.start_time)}-{str(self.end_time)}"

class Invitee(models.Model):
    calendar = models.ForeignKey(Calendar, related_name='invitees', on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    random_link_token = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return f"{self.contact.first_name} invited to {self.calendar.title}"

class Priority(models.Model):
    invitee = models.ForeignKey(Invitee, on_delete=models.CASCADE, editable=False, related_name='selected_availability')
    availability = models.ForeignKey(Availability, on_delete=models.CASCADE)
    priority = models.IntegerField(default=1)  # 1 default priority, 2 high priority

    def __str__(self):
        return f"{self.invitee.contact.first_name}'s selected availability: {self.availability}"

class Event(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    invitee = models.ForeignKey(Invitee, on_delete=models.CASCADE)
    timeslot = models.ForeignKey(Availability, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.calendar.title} with {self.invitee.contact.first_name}: {str(self.timeslot.start_time)}-{str(self.timeslot.end_time)}"
