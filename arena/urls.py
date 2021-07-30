from django.urls import path, include
from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework import routers, serializers, viewsets
from django.contrib import admin
from django.urls import path


urlpatterns = [
    path(r"", lambda req: redirect("arena/")),
    path("admin/", admin.site.urls),
    path(r"arena/", include("game.urls")),
    path(r"api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
