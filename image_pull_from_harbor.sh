#!/bin/bash

for file in docker-compose.yml docker-compose.override.yml components/analytics/docker-compose.analytics.yml components/serverless/docker-compose.serverless.yml;
do
    cat $file |grep image |  cut -d':' -f 2- |xargs -n 1 docker pull
done


