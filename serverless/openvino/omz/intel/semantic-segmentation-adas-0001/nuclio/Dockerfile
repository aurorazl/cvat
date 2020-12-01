FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/openvino.ubuntu18_dev:2020.2
USER root
WORKDIR /opt/nuclio
RUN ln -s /usr/bin/pip3 /usr/bin/pip
RUN /opt/intel/openvino/deployment_tools/open_model_zoo/tools/downloader/downloader.py --name semantic-segmentation-adas-0001 -o /opt/nuclio/open_model_zoo
RUN pip install kfserving==0.3.0
RUN apt update && DEBIAN_FRONTEND=noninteractive apt install --no-install-recommends -y python3-skimage
RUN pip3 install "numpy<1.16.0"
COPY . .
ENTRYPOINT ["/opt/nuclio/python3", "run.py"]
