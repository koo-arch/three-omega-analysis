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

        files_columns_data = (
            self.get_queryset().values("data").first().get("data", {})
            if self.get_queryset().exists()
            else {}
        )

        file_parser = ParseTextFile(files, files_columns_data)
        files_columns_data = file_parser.parse_text_file()

        # エラーがある場合はエラーレスポンスを返す
        if file_parser.column_errors or file_parser.value_errors:
            error_response = {}
            
            for name, errors in file_parser.column_errors.items():
                if name not in error_response:
                    error_response[name] = []
                error_response[name].extend(errors) 
            
            for name, errors in file_parser.value_errors.items():
                if name not in error_response:
                    error_response[name] = []
                error_response[name].extend(errors) 

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
        file_data = self.get_object().data

        if file_name in file_data:
            del file_data[file_name]
            self.get_queryset().update(data=file_data)
            return Response({'detail': 'ファイルを削除しました'}, status=status.HTTP_200_OK)

        return Response({'detail': 'ファイルが見つかりません'}, status=status.HTTP_400_BAD_REQUEST)
