
# Copyright (C) 2018 Intel Corporation
#
# SPDX-License-Identifier: MIT

"""CVAT URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.apps import apps
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('cvat.apps.engine.urls')),
    path('dashboard/', include('cvat.apps.dashboard.urls')),
    path('django-rq/', include('django_rq.urls')),
    path('auth/', include('cvat.apps.authentication.urls')),
    path('documentation/', include('cvat.apps.documentation.urls'))
]

if apps.is_installed('cvat.apps.tf_annotation'):
    urlpatterns.append(path('tf_annotation/', include('cvat.apps.tf_annotation.urls')))

if apps.is_installed('cvat.apps.log_viewer'):
    urlpatterns.append(path('analytics/', include('cvat.apps.log_viewer.urls')))
