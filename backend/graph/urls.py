from django.urls import path, include
from .views import FileProcessingView, FileDeleteView

urlpatterns = [
    path("graph/upload/", FileProcessingView.as_view()),
    path("graph/delete/", FileDeleteView.as_view()),
]