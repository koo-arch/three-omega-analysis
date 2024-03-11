from django.urls import path, include
from .views import SettingView, SettingDetailView, HistoryView, AnalysisView

urlpatterns = [
    path("analysis/calculate/", AnalysisView.as_view()),
    path("analysis/setting/", SettingView.as_view()),
    path("analysis/setting/<int:pk>/", SettingDetailView.as_view()),
    path("analysis/history/", HistoryView.as_view()),
]