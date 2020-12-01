FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/tensorflow/tensorflow:2.1.1-gpu
RUN apt install curl
WORKDIR /opt/nuclio
RUN curl -O http://download.tensorflow.org/models/object_detection/faster_rcnn_inception_v2_coco_2018_01_28.tar.gz
RUN tar -xzf faster_rcnn_inception_v2_coco_2018_01_28.tar.gz && rm faster_rcnn_inception_v2_coco_2018_01_28.tar.gz
RUN ln -s faster_rcnn_inception_v2_coco_2018_01_28 faster_rcnn
RUN pip install pillow pyyaml  kfserving==0.3.0
COPY . .
ENTRYPOINT ["python3", "run.py"]
