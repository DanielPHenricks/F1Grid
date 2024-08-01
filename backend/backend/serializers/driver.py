from rest_framework import serializers

from ..models.models import Driver

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ["driver_id", "forename", "surname", "nationality"]