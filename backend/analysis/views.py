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


class AnalysisView(generics.ListCreateAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        file_data = request.session.get('file_data', None)
        data = request.data

        if file_data is None:
            return Response({'error': 'No data in session'})
        
