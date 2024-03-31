from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Contact(models.Model):
    first_name = models.TextField()
    last_name = models.TextField()
    email_address = models.EmailField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.first_name