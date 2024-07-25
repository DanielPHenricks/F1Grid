from backend.models import Player
from backend.serializers import PlayerSerializer
from rest_framework import generics

class PlayerList(generics.ListCreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer