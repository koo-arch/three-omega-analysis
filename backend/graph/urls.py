from django.urls import path, include
from .views import FileGetView, FileProcessingView, AllGraphDataClearView, GraphDataClearView

urlpatterns = [
    path("graph/get/", FileGetView.as_view()),
    path("graph/upload/", FileProcessingView.as_view()),
    path("graph/clear/all/<int:pk>/", AllGraphDataClearView.as_view()),
    path("graph/clear/<int:pk>/", GraphDataClearView.as_view()),

]