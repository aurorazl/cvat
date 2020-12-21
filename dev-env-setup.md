### window下：
1. 启动redis，记得-p 6379
2. 启动worker容器
```
docker run -it --name cvat --entrypoint="" -v D:\workstate\cvat\:/workstate/cvat harbor.sigsus.cn:8443/sz_gongdianju/cvat/backend:latest bash
export DJANGO_CONFIGURATION=development
cd /workstate/cvat
python3 manage.py rqworker -v 3 default
```
