FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/openvino.ubuntu18_dev:2020.2
USER root
WORKDIR /opt/nuclio
RUN ln -s /usr/bin/pip3 /usr/bin/pip
RUN /opt/intel/openvino/deployment_tools/open_model_zoo/tools/downloader/downloader.py --name text-detection-0004 -o /opt/nuclio/open_model_zoo
RUN pip install kfserving==0.3.0
COPY . .
ENTRYPOINT ["/opt/nuclio/python3", "run.py"]
