from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from backend.models import DriverGuess
from backend.serializers import DriverGuessSerializer

class DriverGuessUpdateView(generics.ListCreateAPIView):
    serializer_class = DriverGuessSerializer

    def get_queryset(self):
        field_one = self.request.query_params.get('field_one')
        field_two = self.request.query_params.get('field_two')

        if not field_one or not field_two:
            raise ValidationError("Both field_one and field_two are required for GET requests.")

        return DriverGuess.objects.filter(
            field_one=field_one,
            field_two=field_two
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        driver_id = self.kwargs.get('driver_id')
        serializer.save(driver_id=driver_id, guess_count=1)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        if instance is None:
            return self.create(request, *args, **kwargs)
        
        instance.guess_count += 1
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def get_object(self):
        queryset = self.get_queryset()
        return queryset.first()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)