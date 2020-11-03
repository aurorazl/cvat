FROM node:12 AS cvat-ui

ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG socks_proxy
ARG PUBLIC_INSTANCE
ARG WA_PAGE_VIEW_HIT

ENV TERM=xterm \
    http_proxy=${http_proxy}   \
    https_proxy=${https_proxy} \
    no_proxy=${no_proxy} \
    socks_proxy=${socks_proxy} \
    LANG='C.UTF-8'  \
    LC_ALL='C.UTF-8'

# Install dependencies
COPY cvat-core/package*.json /tmp/cvat-core/
COPY cvat-canvas/package*.json /tmp/cvat-canvas/
COPY cvat-ui/package*.json /tmp/cvat-ui/
COPY cvat-data/package*.json /tmp/cvat-data/

RUN npm config set registry https://registry.npm.taobao.org

RUN npm config set loglevel info

# Install cvat-data dependencies
WORKDIR /tmp/cvat-data/
RUN npm install

# Install cvat-core dependencies
WORKDIR /tmp/cvat-core/
RUN npm install

# Install cvat-canvas dependencies
WORKDIR /tmp/cvat-canvas/
RUN npm install

# Install cvat-ui dependencies
WORKDIR /tmp/cvat-ui/
RUN npm install

# Build source code
COPY cvat-data/ /tmp/cvat-data/
COPY cvat-core/ /tmp/cvat-core/
COPY cvat-canvas/ /tmp/cvat-canvas/
COPY cvat-ui/ /tmp/cvat-ui/
RUN npm run build

FROM nginx:stable-alpine
# Replace default.conf configuration to remove unnecessary rules
RUN sed -i "s/}/application\/wasm wasm;\n}/g" /etc/nginx/mime.types
COPY cvat-ui/react_nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=cvat-ui /tmp/cvat-ui/dist /usr/share/nginx/html/
