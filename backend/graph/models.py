from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class FileData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    data = models.JSONField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
