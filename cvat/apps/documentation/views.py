
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
        title = "依瞳数据标注平台-用户帮助手册"
    else:
        doc_path = os.path.join(module_dir, 'user_guide.md')
        title = "ADAP User Guide"
    return render(request, 'documentation/user_guide.html',
        context={"user_guide": open(doc_path, "r",encoding="utf-8").read(),"title":title})

def XmlFormatView(request):
    module_dir = os.path.dirname(__file__)
    doc_path = os.path.join(module_dir, 'xml_format.md')

    return render(request, 'documentation/xml_format.html',
        context={"xml_format": open(doc_path, "r").read()})
