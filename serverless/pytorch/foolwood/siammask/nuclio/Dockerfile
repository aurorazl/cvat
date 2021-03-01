FROM harbor.sigsus.cn:8443/sz_gongdianju/apulistech/miniconda3
WORKDIR /opt/nuclio
RUN conda create -y -n siammask python=3.6
SHELL ["conda", "run", "-n", "siammask", "/bin/bash", "-c"]
RUN git clone https://github.com/foolwood/SiamMask.git
RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
RUN pip install -r SiamMask/requirements.txt jsonpickle
RUN conda install -y gcc_linux-64
RUN cd SiamMask && bash make.sh && cd -
RUN wget -P SiamMask/experiments/siammask_sharp http://www.robots.ox.ac.uk/~qwang/SiamMask_DAVIS.pth
RUN pip install kfserving==0.3.0
COPY run.py model_handler.py ./SiamMask/
ENV PYTHONPATH=/opt/nuclio/SiamMask/experiments/siammask_sharp/
ENTRYPOINT ["conda", "run", "-n", "siammask","python", "SiamMask/run.py"]
