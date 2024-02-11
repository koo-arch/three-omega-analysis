from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response

class FileProcessingView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        if 'file_data' in request.session:
            return Response(request.session['file_data'])
        else:
            return Response({"message": "データがありません。ファイルをアップロードしてください。"})

    def post(self, request, *args, **kwargs):    
        files = request.FILES.getlist('files')

        files_columns_data = request.session.get('file_data', {})

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
                            measurement_data_point[column] = float(values[i])
                        measurement_data.append(measurement_data_point)

                # Coulmns>> からデータ処理を開始する
                elif line.startswith('Columns>>'):
                    columns = line.split('Columns>> ')[1].strip().split()
                    for column in columns:
                        column_names.append(column)
                    start_processing = True

            file_name = file.name.split('.')[0]
            files_columns_data[file_name] = measurement_data

            request.session['file_data'] = files_columns_data

        
        return Response(request.session['file_data'])
    

class FileDeleteView(APIView):
    permission_classes = (permissions.AllowAny,)

    def delete(self, request, *args, **kwargs):
        file_name = request.data.get('file_name')
        files_columns_data = request.session.get('file_data', {})

        if file_name in files_columns_data:
            del files_columns_data[file_name]
            request.session['file_data'] = files_columns_data
            return Response({"message": "ファイルが削除されました。"})
        
        return Response({"message": "ファイルが見つかりません。"})