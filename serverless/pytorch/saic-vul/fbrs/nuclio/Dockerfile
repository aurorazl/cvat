FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/python:3.6.11-cuda10.1
WORKDIR /opt/nuclio
RUN git clone https://github.com/saic-vul/fbrs_interactive_segmentation.git fbrs
WORKDIR /opt/nuclio/fbrs
ENV fileid=1Z9dQtpWVTobEdmUBntpUU0pJl-pEXUwR
ENV filename=resnet101_dh256_sbd.pth
RUN curl -c ./cookie -s -L "https://drive.google.com/uc?export=download&id=${fileid}"
RUN curl -Lb ./cookie "https://drive.google.com/uc?export=download&confirm=`awk '/download/ {print $NF}' ./cookie`&id=${fileid}" -o ${filename}
RUN apt update && apt install -y libgl1-mesa-glx
RUN pip3 install -r requirements.txt
WORKDIR /opt/nuclio
RUN pip install kfserving==0.3.0
ENV PYTHONPATH=/opt/nuclio/fbrs
COPY . .
ENTRYPOINT ["python3", "run.py"]

