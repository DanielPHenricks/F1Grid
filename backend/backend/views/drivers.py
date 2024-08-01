from backend.models import Driver
from backend.serializers import DriverSerializer
from rest_framework import generics

class DriverList(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
