from rest_framework import serializers
from .models import Setting, History
from django.contrib.auth import get_user_model

User = get_user_model()

class SettingSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Setting
        fields = "__all__"

    def validate(self, attrs):
        return super().validate(attrs)


class HistorySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    settings = serializers.PrimaryKeyRelatedField(queryset=Setting.objects.all())

    class Meta:
        model = History
        fields = "__all__"

    def validate(self, attrs):
        return super().validate(attrs)
