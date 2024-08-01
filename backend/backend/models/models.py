from django.db import models

class Player(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=100, blank=False)

class Driver(models.Model):
    driver_id = models.IntegerField()
    forename = models.CharField(max_length=100, blank=False)
    surname = models.CharField(max_length=100, blank=False)
    nationality = models.CharField(max_length=100, blank=False)
