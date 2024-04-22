from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import FileData
from .serializers import FileDataSerializer
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

        defalut_columns = ["Current_Freq(Hz)", "Heater_Freq(Hz)", "Vomega(V)", "ImVomega(V)", "V3omega(V)", "ImV3omega(V)"]

        for file in files:
            lines = file.read().decode('utf-8').splitlines()

            start_processing = False
            measurement_data = []
            column_names = []

            for line in lines:
                measurement_data_point = {}

                if start_processing:
                    values = line.strip().split()
                    # 測定データを列ごとに分割してmeasurement_dataに追加
                    if len(values) > 1:
                        for i, column in enumerate(column_names):
                            try:
                                measurement_data_point[column] = float(values[i])
                            except ValueError:
                                raise FileProcessingException(detail='ファイルのデータが不正です。')
                        measurement_data.append(measurement_data_point)

                # Coulmns>> からデータ処理を開始する
                elif line.startswith('Columns>>'):
                    columns = line.split('Columns>> ')[1].strip().split()
                    for column in columns:
                        column_names.append(column)
                    if column_names != defalut_columns:
                        raise FileProcessingException(detail='ファイルの列名が不正です。')
                    start_processing = True

            file_name = file.name.split('.')[0]
            files_columns_data[file_name] = measurement_data

        register_data = {
            "user": request.user.id,
            "name": file_name,
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


class FileDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = FileData.objects.all()
    serializer_class = FileDataSerializer


class FileDataDeleteView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = FileData.objects.all()
    serializer_class = FileDataSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def post(self, request, *args, **kwargs):
        file_name = request.data.get('file_name')
        file_data = self.queryset.filter(user=request.user).values('data').first().get('data', {})

        if file_name in file_data:
            del file_data[file_name]
            self.get_queryset().update(data=file_data)
            return Response({'detail': 'ファイルを削除しました'}, status=status.HTTP_200_OK)

        return Response({'detail': 'ファイルが見つかりません'}, status=status.HTTP_400_BAD_REQUEST)
