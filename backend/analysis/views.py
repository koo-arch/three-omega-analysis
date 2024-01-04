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

            file_columns_data = {}
            start_processing = False

            for line in lines:
                if start_processing:
                    values = line.strip().split()
                    if len(values) > 1:
                        for i, column  in enumerate(file_columns_data.keys()):
                            file_columns_data[column].append(values[i])
        
                elif line.startswith('Columns>>'):
                    columns = line.split('Columns>> ')[1].strip().split()
                    for column in columns:
                        file_columns_data[column] = []
                    start_processing = True

            files_columns_data[file.name] = file_columns_data
        
        return Response(files_columns_data)