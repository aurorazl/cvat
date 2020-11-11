#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

nuctl create project cvat -n nuclio

nuctl deploy faster-rcnn-inception-v2-coco -n nuclio --project-name cvat \
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/openvino.omz.public.faster_rcnn_inception_v2_coco \
    --file "$SCRIPT_DIR/openvino/omz/public/faster_rcnn_inception_v2_coco/nuclio/function.yaml" \
    --volume "$SCRIPT_DIR/openvino/common:/opt/nuclio/common"

nuctl deploy mask-rcnn-inception-resnet-v2-atrous-coco -n nuclio --project-name cvat \
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/openvino.omz.public.mask_rcnn_inception_resnet_v2_atrous_coco \
    --file "$SCRIPT_DIR/openvino/omz/public/mask_rcnn_inception_resnet_v2_atrous_coco/nuclio/function.yaml" \
    --volume "$SCRIPT_DIR/openvino/common:/opt/nuclio/common"

nuctl deploy yolo-v3-tf --project-name cvat -n nuclio \
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/openvino.omz.public.yolo-v3-tf \
    --file "$SCRIPT_DIR/openvino/omz/public/yolo-v3-tf/nuclio/function.yaml" \
    --volume "$SCRIPT_DIR/openvino/common:/opt/nuclio/common"

nuctl deploy text-detection-0004 --project-name cvat -n nuclio\
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/openvino.omz.intel.text-detection-0004 \
    --file "$SCRIPT_DIR/openvino/omz/intel/text-detection-0004/nuclio/function.yaml" \
    --volume "$SCRIPT_DIR/openvino/common:/opt/nuclio/common"

nuctl deploy intel.semantic-segmentation-adas-0001 --project-name cvat -n nuclio\
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/openvino.omz.intel.semantic-segmentation-adas-0001 \
    --file "$SCRIPT_DIR/openvino/omz/intel/semantic-segmentation-adas-0001/nuclio/function.yaml" \
    --volume "$SCRIPT_DIR/openvino/common:/opt/nuclio/common"

nuctl deploy person-reidentification-retail-0300 --project-name cvat -n nuclio\
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/openvino.omz.intel.person-reidentification-retail-0300 \
    --file "$SCRIPT_DIR/openvino/omz/intel/person-reidentification-retail-300/nuclio/function.yaml" \
    --volume "$SCRIPT_DIR/openvino/common:/opt/nuclio/common"

nuctl deploy openvino-dextr --project-name cvat -n nuclio\
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/openvino.dextr \
    --file "$SCRIPT_DIR/openvino/dextr/nuclio/function.yaml" \
    --volume "$SCRIPT_DIR/openvino/common:/opt/nuclio/common"

nuctl deploy mask-rcnn --project-name cvat -n nuclio\
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/tf.matterport.mask_rcnn \
    --file "$SCRIPT_DIR/tensorflow/matterport/mask_rcnn/nuclio/function.yaml"

nuctl deploy faster-rcnn-inception-v2-coco --project-name cvat -n nuclio\
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/tf.faster_rcnn_inception_v2_coco \
    --file "$SCRIPT_DIR/tensorflow/faster_rcnn_inception_v2_coco/nuclio/function.yaml"

nuctl deploy siammask --project-name cvat -n nuclio\
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/pth.foolwood.siammask \
    --file "$SCRIPT_DIR/pytorch/foolwood/siammask/nuclio/function.yaml" \

nuctl deploy fbrs --project-name cvat -n nuclio\
    --run-image harbor.sigsus.cn:8443/sz_gongdianju/cvat/pth.saic-vul.fbrs \
    --file "$SCRIPT_DIR/pytorch/saic-vul/fbrs/nuclio/function.yaml"

nuctl get function -n nuclio
