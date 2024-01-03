from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Setting(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    dRdT = models.FloatField()
    length = models.FloatField()

    def __str__(self):
        return self.name


class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    setting = models.ForeignKey(Setting, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.setting.name} - {self.date.strftime('%d/%m/%Y %H:%M')}"
