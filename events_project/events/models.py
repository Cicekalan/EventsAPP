from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class UserEvent(models.Model):
    userId = models.CharField(max_length=100)
    eventId = models.IntegerField()