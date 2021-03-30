FROM ubuntu:20.04

ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG socks_proxy
ARG TZ='Etc/UTC'

ENV TERM=xterm \
    http_proxy=${http_proxy}   \
    https_proxy=${https_proxy} \
    no_proxy=${no_proxy} \
    socks_proxy=${socks_proxy} \
    LANG='C.UTF-8'  \
    LC_ALL='C.UTF-8' \
    TZ=${TZ}

ARG USER='django'
ARG DJANGO_CONFIGURATION='production'
ENV DJANGO_CONFIGURATION=${DJANGO_CONFIGURATION}

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list

# Install necessary apt packages
RUN apt-get update && \
    apt-get --no-install-recommends install -yq \
        software-properties-common && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get --no-install-recommends install -yq \
        apache2 \
        apache2-dev \
        apt-utils \
        build-essential \
        libapache2-mod-xsendfile \
        supervisor \
        libavcodec-dev=7:4.2.4-1ubuntu0.1 \
        libavdevice-dev=7:4.2.4-1ubuntu0.1 \
        libavfilter-dev=7:4.2.4-1ubuntu0.1 \
        libavformat-dev=7:4.2.4-1ubuntu0.1 \
        libavutil-dev=7:4.2.4-1ubuntu0.1 \
        libswresample-dev=7:4.2.4-1ubuntu0.1 \
        libswscale-dev=7:4.2.4-1ubuntu0.1 \
        libldap2-dev \
        libsasl2-dev \
        pkg-config \
        python3-dev \
        python3-pip \
        tzdata \
        p7zip-full \
        git \
        git-lfs \
        ssh \
        poppler-utils \
        curl \
        unrar \
        vim \
        sudo \
        libgeos-dev \
        postgresql-client-12\
        postgresql-client-common

RUN python3 -m pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/ && \
    python3 -m pip install --no-cache-dir -U pip setuptools wheel && \
    ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    rm -rf /var/lib/apt/lists/* && \
    echo 'application/wasm wasm' >> /etc/mime.types

# Add a non-root user
ENV USER=${USER}
ENV HOME /home/${USER}
WORKDIR ${HOME}
RUN adduser --shell /bin/bash --disabled-password --gecos "" ${USER} && \
    if [ -z ${socks_proxy} ]; then \
        echo export "GIT_SSH_COMMAND=\"ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30\"" >> ${HOME}/.bashrc; \
    else \
        echo export "GIT_SSH_COMMAND=\"ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 -o ProxyCommand='nc -X 5 -x ${socks_proxy} %h %p'\"" >> ${HOME}/.bashrc; \
    fi && \
    adduser ${USER} sudo && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Install and initialize CVAT, copy all necessary files
COPY cvat/requirements/ /tmp/requirements/
RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
RUN pip install -r /tmp/requirements/${DJANGO_CONFIGURATION}.txt

COPY supervisord.conf mod_wsgi.conf wait-for-it.sh manage.py ${HOME}/

ARG CLAM_AV='no'
ENV CLAM_AV=${CLAM_AV}
RUN if [ "$CLAM_AV" = "yes" ]; then \
        apt-get update && \
        apt-get --no-install-recommends install -yq \
            clamav \
            libclamunrar9 && \
        sed -i 's/ReceiveTimeout 30/ReceiveTimeout 300/g' /etc/clamav/freshclam.conf && \
        freshclam && \
        chown -R ${USER}:${USER} /var/lib/clamav && \
        rm -rf /var/lib/apt/lists/*; \
    fi

COPY components /tmp/components

COPY ssh ${HOME}/.ssh
COPY utils ${HOME}/utils
COPY cvat-core/ ${HOME}/cvat-core
COPY cvat-data/ ${HOME}/cvat-data
COPY tests ${HOME}/tests
COPY locale/ ${HOME}/locale
COPY cvat ${HOME}/cvat


RUN chown ${USER}:${USER} .
# RUN all commands below as 'django' user
USER ${USER}

RUN mkdir -p data share media keys logs /tmp/supervisord tmp
RUN python3 manage.py collectstatic

EXPOSE 8080 8443
ENV PYTHONIOENCODING="utf-8"
ENTRYPOINT ["/usr/bin/supervisord"]
