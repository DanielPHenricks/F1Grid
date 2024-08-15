from backend.models import Constructor
from backend.serializers import ConstructorSerializer
from rest_framework import generics

class ConstructorList(generics.ListCreateAPIView):
    queryset = Constructor.objects.all()
    serializer_class = ConstructorSerializer
