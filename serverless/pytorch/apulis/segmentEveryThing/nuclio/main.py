# Copyright (C) 2020 Apulis Technology Inc.
#
# SPDX-License-Identifier: MIT

import json
import base64
from PIL import Image
import io
from model_handler import ModelHandler

def init_context(context):
    context.logger.info("Init context...  0%")

    model = ModelHandler()
    setattr(context.user_data, 'model', model)

    context.logger.info("Init context...100%")

def handler(context, event):
    context.logger.info("call handler")
    data = event.body
    threshold = data.get("threshold", 0.5)
    buf = io.BytesIO(base64.b64decode(data["image"].encode('utf-8')))
    image = Image.open(buf)

    infer_result = context.user_data.model.handle(image, threshold)
    return context.Response(body=json.dumps(infer_result),
                            headers={},
                            content_type='application/json',
                            status_code=200)
