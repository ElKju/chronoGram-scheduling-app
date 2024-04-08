from django.contrib import admin
from .models import Calendar, Availability, Invitee, Priority, SuggestedEvent, SuggestedSchedule

# Register your models here.
admin.site.register(Calendar)
admin.site.register(Availability)
admin.site.register(Invitee)
admin.site.register(Priority)
admin.site.register(SuggestedSchedule)
admin.site.register(SuggestedEvent)