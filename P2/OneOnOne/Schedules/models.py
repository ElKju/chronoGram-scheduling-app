from django.db import models
from django.contrib.auth.models import User
from django.core.mail import send_mail
from datetime import timedelta
from django.conf import settings

class Schedule(models.Model):
    title = models.TextField()
    description = models.TextField()
    invitee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedule_invitee', blank=True, null=True)
    duration = models.DurationField(default=timedelta(minutes=30))
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    finalized = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def send_finalized_email(self):
        subject = f"Notification: Schedule '{self.title}' Finalized"
        message = "The event you were scheduled to attend has been finalized.\n\n"
        message += f"Title: {self.title}\n"
        message += f"Description: {self.description}\n"
        message += f"Date: {self.date}\n"
        message += f"Invitee: {self.invitee}\n"
        message += f"Owner: {self.owner}\n"
        message += f"Finalized: {self.finalized}\n"
        message += f"Duration: {self.duration}\n\n"
        message += "Please do not reply to this email."
        message += "Thank you for using ChronoGram!"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [self.invitee.email, self.owner.email]
        send_mail(subject, message, from_email, recipient_list)

    def send_request_email(self, new_time):
        subject = f"Notification: New Time Requested for '{self.title}'"
        from_email = settings.DEFAULT_FROM_EMAIL
        message = f"Your friend {self.invitee} has requested a new time for '{self.title}' on {self.date} at {new_time}."
        recipient_list = [self.invitee.email, self.owner.email]
        send_mail(subject, message, from_email, recipient_list)
