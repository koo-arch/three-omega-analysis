from django.urls import path, include
from .views import FileProcessingView

urlpatterns = [
    path("analysis/upload/", FileProcessingView.as_view()),
]