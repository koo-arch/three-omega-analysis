from rest_framework import generics, permissions, status
from .models import Setting, History
from .serializers import SettingSerializer, HistorySerializer
from django.http import HttpResponse
from rest_framework.response import Response
from .calc import MeasurementFileParser, ThermalConductivityStats
import csv
import codecs

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

        if not file_data:
            return Response({'detail': 'データがありません。'}, status=status.HTTP_400_BAD_REQUEST)
        
        parser = MeasurementFileParser(data, file_data)
        experiment_data = parser.get_experiment_data()
        if parser.error_points:
            error_response = {}
            for name in parser.error_points:
                error_response[f"graphs.{name}"] = f"{name}が未選択です"
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

        # HTTPレスポンスを作成し、CSVファイルとして返す
        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response.write(codecs.BOM_UTF8)  # UTF-8のBOM（バイト順マーク）を追加（日本語表示に必要）

        writer = csv.writer(response, delimiter=",", quotechar='"')
        writer.writerow(["temprature", "kappa_ave", "kappa_std", "Im_kappa_ave", "Im_kappa_std", "start_point", "end_point"])


        for condition in experiment_data.values():

            dRdT = condition["dRdT"]
            length = condition["length"]
            current = condition["current"]
            temperature = condition["temperature"]
            measurement_data = condition["measurement_data"]
            start_point = condition["start_point"]
            end_point = condition["end_point"]

            stats = ThermalConductivityStats(dRdT, length, current, temperature, measurement_data)
            kappa_ave, kappa_std = stats.average_and_std_of_kappa(start_point, end_point)
            Im_kappa_ave, Im_kappa_std = stats.average_and_std_of_kappa_imaginary(range(start_point, end_point + 1))

            writer.writerow([temperature, kappa_ave, kappa_std, Im_kappa_ave, Im_kappa_std, start_point, end_point])

        return response
