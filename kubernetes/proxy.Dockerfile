FROM nginx:stable-alpine
COPY ./cvat_proxy/nginx.conf /etc/nginx/nginx.conf
COPY ./cvat_proxy/conf.d/cvat.conf.template /etc/nginx/conf.d/cvat.conf.template
