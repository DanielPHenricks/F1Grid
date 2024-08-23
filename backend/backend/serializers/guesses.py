from rest_framework import serializers
from backend.models import DriverGuess

class DriverGuessSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverGuess
        fields = ['driver_id', 'grid_id', 'field_one', 'field_two', 'guess_count']