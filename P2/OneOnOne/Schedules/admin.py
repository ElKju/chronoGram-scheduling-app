from django.contrib import admin
from .models import Calendar, Availability, Invitee, Event, Priority

# Register your models here.
admin.site.register(Calendar)
admin.site.register(Availability)
admin.site.register(Invitee)
admin.site.register(Event)
admin.site.register(Priority)
