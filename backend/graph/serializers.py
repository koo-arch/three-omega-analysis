from rest_framework import serializers
from .models import FileData

class FileDataSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = FileData
        fields = '__all__'