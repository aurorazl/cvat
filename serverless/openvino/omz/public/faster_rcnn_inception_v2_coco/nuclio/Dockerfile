FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/openvino.ubuntu18_dev:2020.2
USER root
WORKDIR /opt/nuclio
RUN ln -s /usr/bin/pip3 /usr/bin/pip
RUN /opt/intel/openvino/deployment_tools/open_model_zoo/tools/downloader/downloader.py --name faster_rcnn_inception_v2_coco -o /opt/nuclio/open_model_zoo
RUN /opt/intel/openvino/deployment_tools/open_model_zoo/tools/downloader/converter.py --name faster_rcnn_inception_v2_coco --precisions FP32 -d /opt/nuclio/open_model_zoo -o /opt/nuclio/open_model_zoo
RUN pip install kfserving==0.3.0
COPY . .
ENTRYPOINT ["/opt/nuclio/common/python3", "run.py"]
