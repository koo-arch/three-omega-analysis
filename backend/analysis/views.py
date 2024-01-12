from rest_framework import generics
from rest_framework import permissions
from .models import Setting, History
from .serializers import SettingSerializer, HistorySerializer
from rest_framework.response import Response

class SettingView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer


class HistoryView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = History.objects.all()
    serializer_class = HistorySerializer

    def post(self, request, *args, **kwargs):
        serializer = HistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)