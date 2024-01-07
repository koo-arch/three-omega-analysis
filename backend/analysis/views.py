from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response

class FileProcessingView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('files')

        files_columns_data = {}

        for file in files:
            lines = file.read().decode('utf-8').splitlines()

            start_processing = False
            measurement_data = []
            column_names = []


            for line in lines:
                measurement_data_point = {}
                if start_processing:
                    values = line.strip().split()
                    if len(values) > 1:
                        for i, column in enumerate(column_names):
                            measurement_data_point[column] = values[i]
                        measurement_data.append(measurement_data_point)

        
                elif line.startswith('Columns>>'):
                    columns = line.split('Columns>> ')[1].strip().split()
                    for column in columns:
                        column_names.append(column)
                    start_processing = True

            files_columns_data[file.name] = measurement_data
        
        return Response(files_columns_data)