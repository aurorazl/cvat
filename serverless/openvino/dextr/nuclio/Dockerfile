FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/openvino.ubuntu18_dev:2020.2
USER root
WORKDIR /opt/nuclio
RUN ln -s /usr/bin/pip3 /usr/bin/pip
RUN curl -O https://download.01.org/openvinotoolkit/models_contrib/cvat/dextr_model_v1.zip
RUN unzip dextr_model_v1.zip
RUN pip install Pillow kfserving==0.3.0
COPY . .
ENTRYPOINT ["/opt/nuclio/python3", "run.py"]
