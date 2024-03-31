from django.contrib import admin
from .models import Calendar, Availability, Invitee, Event

# Register your models here.
admin.site.register(Calendar)
admin.site.register(Availability)
admin.site.register(Invitee)
admin.site.register(Event)

# fix all code