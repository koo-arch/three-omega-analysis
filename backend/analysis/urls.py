from django.urls import path, include
from .views import SettingView, HistoryView, AnalysisView

urlpatterns = [
    path("analysis/", AnalysisView.as_view()),
    path("analysis/setting/", SettingView.as_view()),
    path("analysis/history/", HistoryView.as_view()),
]