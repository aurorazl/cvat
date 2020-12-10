import kfserving
import json
import base64
from PIL import Image
import io
from model_handler import ModelHandler
import os
import argparse
import yaml

DEFAULT_MODEL_NAME = "model"

class KFServingSampleModel(kfserving.KFModel):
    def __init__(self, name: str):
        super().__init__(name)
        self.name = name
        self.ready = False

    def load(self):
        self.infer_model = ModelHandler()
        self.ready = True

    def predict(self, request):
        if isinstance(request,str):
            request = json.loads(request)
        buf0 = io.BytesIO(base64.b64decode(request["image0"].encode('utf-8')))
        buf1 = io.BytesIO(base64.b64decode(request["image1"].encode('utf-8')))
        threshold = float(request.get("threshold", 0.5))
        max_distance = float(request.get("max_distance", 50))
        image0 = Image.open(buf0)
        image1 = Image.open(buf1)
        boxes0 = request["boxes0"]
        boxes1 = request["boxes1"]
        results = self.infer_model.infer(image0, boxes0,image1, boxes1, threshold, max_distance)
        return json.dumps(results)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(parents=[kfserving.kfserver.parser])
    parser.add_argument('--model_name', default=DEFAULT_MODEL_NAME,
                        help='The name that the model is served under.')
    args, _ = parser.parse_known_args()
    model = KFServingSampleModel(args.model_name)
    model.load()
    kfserving.KFServer(workers=1).start([model])
