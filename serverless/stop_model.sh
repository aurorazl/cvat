#!/bin/bash
nuctl delete function faster-rcnn-inception-v2-coco -n nuclio
nuctl delete function mask-rcnn-inception-resnet-v2-atrous-coco -n nuclio
nuctl delete function yolo-v3-tf -n nuclio
nuctl delete function text-detection-0004 -n nuclio
nuctl delete function intel.semantic-segmentation-adas-0001 -n nuclio
nuctl delete function person-reidentification-retail-0300 -n nuclio
nuctl delete function openvino-dextr -n nuclio
nuctl delete function mask-rcnn -n nuclio
nuctl delete function faster-rcnn-inception-v2-coco -n nuclio
nuctl delete function siammask -n nuclio
nuctl delete function fbrs -n nuclio
