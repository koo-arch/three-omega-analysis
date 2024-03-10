from django.urls import path, include
from .views import FileGetView, FileProcessingView, FileDeleteView, FileDataDeleteView

urlpatterns = [
    path("graph/get/", FileGetView.as_view()),
    path("graph/upload/", FileProcessingView.as_view()),
    path("graph/delete/<int:pk>/", FileDeleteView.as_view()),
    path("graph/data/delete/", FileDataDeleteView.as_view()),

]