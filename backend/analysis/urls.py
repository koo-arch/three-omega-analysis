from django.urls import path, include
from .views import SettingView, HistoryView

urlpatterns = [
    path("analysis/setting/", SettingView.as_view()),
    path("analysis/history/", HistoryView.as_view()),
]