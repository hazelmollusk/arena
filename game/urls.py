from django.urls import path, include
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.templatetags.static import static
from rest_framework.schemas import get_schema_view
from rest_framework import routers, serializers, viewsets

from walax.routers import WalaxRouter
from .models import *

router = WalaxRouter()
for model in [Player]:
    router.register_model(model)

urlpatterns = [
    path(r"api/", include(router.urls)),
    # path(r'api/', include(router.urls)),
    # path(r'api/', get_schema_view(
    #     title="Record Stores",
    #     description="API for example application",
    #     version="1.0.0"
    # ), name='openapi-schema'),
    path("", lambda req: redirect(static("arena/index.html")), name="index"),
]
