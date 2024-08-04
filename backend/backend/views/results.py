from backend.models import Result
from backend.serializers import ResultSerializer
from rest_framework import generics
from rest_framework.filters import BaseFilterBackend

class DriverFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        driver_id = request.query_params.get('driver_id')
        if driver_id:
            return queryset.filter(driver_id=driver_id)
        return queryset

class ResultList(generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    filter_backends = [DriverFilter]