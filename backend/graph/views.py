from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import FileData
from .serializers import FileDataSerializer
from .parse_file import ParseTextFile
from .exceptions import FileProcessingException


class FileGetView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = FileData.objects.all()
    serializer_class = FileDataSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class FileProcessingView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = FileData.objects.all()
    serializer_class = FileDataSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def post(self, request, *args, **kwargs):    
        files = request.FILES.getlist('files')
        queryset = self.get_queryset()
        files_columns_data = (
            queryset.values("data").first().get("data", {})
            if queryset.exists()
            else {}
        )

        file_parser = ParseTextFile(files, files_columns_data)
        files_columns_data = file_parser.parse_text_file()

        # エラーがある場合はエラーレスポンスを返す
        error_response = file_parser.parse_errors()
        if error_response:
            raise FileProcessingException(detail=error_response)

        register_data = {
            "user": request.user.id,
            "name": "graph_data",
            "data": files_columns_data
        }

        serializer = self.get_serializer(data=register_data)

        if serializer.is_valid():
            serializer_instance, create = self.queryset.update_or_create(
                user=request.user,
                defaults=serializer.validated_data
            )
            response_serializer = self.get_serializer(serializer_instance)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED if create else status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllGraphDataClearView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = FileData.objects.all()
    serializer_class = FileDataSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def patch(self, request, *args, **kwargs):
        update_count = self.get_queryset().update(data={})

        if update_count == 0:
            return Response({'detail': 'データが見つかりません'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'detail': 'データがクリアされました'}, status=status.HTTP_204_NO_CONTENT)


class GraphDataClearView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = FileData.objects.all()
    serializer_class = FileDataSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user, pk=self.kwargs.get('pk'))

    def patch(self, request, *args, **kwargs):
        file_name = request.data.get('file_name')
        obj = self.get_object()
        file_data = obj.data

        if file_name in file_data:
            del file_data[file_name]
            obj.save()
            return Response({'detail': 'ファイルを削除しました'}, status=status.HTTP_204_NO_CONTENT)

        return Response({'detail': 'ファイルが見つかりません'}, status=status.HTTP_400_BAD_REQUEST)
