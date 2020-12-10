
# Copyright (C) 2018 Intel Corporation
#
# SPDX-License-Identifier: MIT

from django.shortcuts import render
import os

def UserGuideView(request):
    module_dir = os.path.dirname(__file__)
    language = request.GET.get('language',"en-US")
    if language == "zh-CN":
        doc_path = os.path.join(module_dir, 'user_guide_zh.md')
    else:
        doc_path = os.path.join(module_dir, 'user_guide.md')
    return render(request, 'documentation/user_guide.html',
        context={"user_guide": open(doc_path, "r",encoding="utf-8").read()})

def XmlFormatView(request):
    module_dir = os.path.dirname(__file__)
    doc_path = os.path.join(module_dir, 'xml_format.md')

    return render(request, 'documentation/xml_format.html',
        context={"xml_format": open(doc_path, "r").read()})
