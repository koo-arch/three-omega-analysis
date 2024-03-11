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
        # 更新する場合は、その名前が他の設定と重複していないかを確認する
        id = self.instance.id if self.instance else None
        name = attrs.get("name")
       
        if Setting.objects.exclude(id=id).filter(name=name, user=self.context["request"].user).exists():
                raise serializers.ValidationError({"name": "この名前は既に使われています。"})
        return super().validate(attrs)


class HistorySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    settings = serializers.PrimaryKeyRelatedField(queryset=Setting.objects.all())

    class Meta:
        model = History
        fields = "__all__"

    def validate(self, attrs):
        return super().validate(attrs)
