import kfserving
import json
import base64
from PIL import Image
import io
from model_handler import ModelHandler
import os
import argparse

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
        pos_points = request["points"]
        neg_points = []
        threshold = request.get("threshold", 0.5)
        buf = io.BytesIO(base64.b64decode(request["image"].encode('utf-8')))
        image = Image.open(buf)
        results = self.infer_model.handle(image, pos_points,neg_points, threshold)
        return json.dumps(results)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(parents=[kfserving.kfserver.parser])
    parser.add_argument('--model_name', default=DEFAULT_MODEL_NAME,
                        help='The name that the model is served under.')
    args, _ = parser.parse_known_args()
    model = KFServingSampleModel(args.model_name)
    model.load()
    kfserving.KFServer(workers=1).start([model])
