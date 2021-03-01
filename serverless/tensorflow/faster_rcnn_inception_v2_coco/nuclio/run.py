import kfserving
import json
import base64
from PIL import Image
import io
from model_loader import ModelLoader
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
        model_path = "/opt/nuclio/faster_rcnn/frozen_inference_graph.pb"
        self.model_handler = ModelLoader(model_path)
        functionconfig = yaml.safe_load(open("/opt/nuclio/function.yaml"))
        labels_spec = functionconfig['metadata']['annotations']['spec']
        self.labels = {item['id']: item['name'] for item in json.loads(labels_spec)}
        self.ready = True

    def predict(self, request):
        if isinstance(request,str):
            request = json.loads(request)
        threshold = request.get("threshold", 0.5)
        buf = io.BytesIO(base64.b64decode(request["image"].encode('utf-8')))
        image = Image.open(buf)
        (boxes, scores, classes, num_detections) = self.model_handler.infer(image)
        results = []
        for i in range(int(num_detections[0])):
            obj_class = int(classes[0][i])
            obj_score = scores[0][i]
            obj_label = self.labels.get(obj_class, "unknown")
            if obj_score >= threshold:
                xtl = boxes[0][i][1] * image.width
                ytl = boxes[0][i][0] * image.height
                xbr = boxes[0][i][3] * image.width
                ybr = boxes[0][i][2] * image.height

                results.append({
                    "confidence": str(obj_score),
                    "label": obj_label,
                    "points": [xtl, ytl, xbr, ybr],
                    "type": "rectangle",
                })
        return json.dumps(results)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(parents=[kfserving.kfserver.parser])
    parser.add_argument('--model_name', default=DEFAULT_MODEL_NAME,
                        help='The name that the model is served under.')
    args, _ = parser.parse_known_args()
    model = KFServingSampleModel(args.model_name)
    model.load()
    kfserving.KFServer(workers=1).start([model])
