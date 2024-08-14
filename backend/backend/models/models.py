from django.db import models

class Player(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=100, blank=False)

class Driver(models.Model):
    driver_id = models.IntegerField()
    forename = models.CharField(max_length=100, blank=False)
    surname = models.CharField(max_length=100, blank=False)
    nationality = models.CharField(max_length=100, blank=False)

class Result(models.Model):
    result_id = models.IntegerField()
    race_id = models.IntegerField()
    driver_id = models.IntegerField()
    constructor_id = models.IntegerField()
    position_text = models.CharField(max_length=50)

class Constructor(models.Model):
    constructor_id = models.IntegerField()
    constructorRef = models.CharField(max_length=100)
    constructor_name = models.CharField(max_length=100)
    
