FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/tensorflow:1.13.1-gpu-py3
WORKDIR /opt/nuclio
RUN apt update && apt install --no-install-recommends -y git curl libsm6 libxext6 libxrender-dev libgl1-mesa-glx
RUN git clone https://github.com/matterport/Mask_RCNN.git
RUN curl -L https://github.com/matterport/Mask_RCNN/releases/download/v2.0/mask_rcnn_coco.h5 -o Mask_RCNN/mask_rcnn_coco.h5
RUN add-apt-repository ppa:jonathonf/python-3.6 && apt update && apt install -y python3.6 python3.6-dev wget && wget https://bootstrap.pypa.io/get-pip.py && python3.6 get-pip.py
COPY requirements.txt .
RUN pip3.6 install -r requirements.txt
RUN pip3.6 install tensorflow-gpu==1.13.1 pycocotools keras==2.1.0 pillow pyyaml  kfserving==0.3.0
COPY . .
ENV MASK_RCNN_DIR=/opt/nuclio/Mask_RCNN
ENTRYPOINT ["python3.6", "run.py"]

