from django.urls import path, include
from .views import FileProcessingView

urlpatterns = [
    path("graph/upload/", FileProcessingView.as_view()),
]