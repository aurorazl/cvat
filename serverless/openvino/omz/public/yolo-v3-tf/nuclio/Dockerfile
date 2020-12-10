FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/openvino.ubuntu18_dev:2020.2
USER root
WORKDIR /opt/nuclio
RUN ln -s /usr/bin/pip3 /usr/bin/pip
RUN /opt/intel/openvino/deployment_tools/open_model_zoo/tools/downloader/downloader.py --name yolo-v3-tf -o /opt/nuclio/open_model_zoo
RUN /opt/intel/openvino/deployment_tools/open_model_zoo/tools/downloader/converter.py --name yolo-v3-tf --precisions FP32 -d /opt/nuclio/open_model_zoo -o /opt/nuclio/open_model_zoo
RUN apt update && DEBIAN_FRONTEND=noninteractive apt install --no-install-recommends -y python3-skimage
RUN pip install "numpy<1.16.0" kfserving==0.3.0
COPY . .
ENTRYPOINT ["/opt/nuclio/python3", "run.py"]
