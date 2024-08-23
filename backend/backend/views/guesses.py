from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from backend.models import DriverGuess
from backend.serializers import DriverGuessSerializer

class DriverGuessUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = DriverGuessSerializer
    lookup_field = 'driver_id'

    serializer_class = DriverGuessSerializer
    lookup_field = 'driver_id'

    def get_object(self):
        driver_id = self.kwargs.get('driver_id')
        obj = DriverGuess.objects.filter(driver_id=driver_id).first()
        return obj

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if instance is None:
            # If the object doesn't exist, create a new one
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If the object exists, update it
        instance.guess_count += 1
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(guess_count=1)

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)