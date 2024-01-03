from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

# Register your models here.
CustomUser = get_user_model()


class UserAdminCustom(UserAdmin):
    # ユーザー詳細
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "username",
                    "email",
                    "password",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
    )

    # ユーザー追加
    add_fieldsets = (
        None,
        {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "password1",
                "password2",
                "is_active",
                "is_staff",
                "is_superuser",
            ),
        },
    )

    list_display = (
        "id",
        "username",
        "email",
        "is_active",
    )

    list_filter = ()
    # 検索
    search_fields = ("email",)
    # 順番
    ordering = ("id",)


admin.site.register(CustomUser, UserAdminCustom)
