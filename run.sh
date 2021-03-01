#!/bin/bash


sed "s/\(value:\s'0'\)/value: '1'/g" -i /home/dlwsadmin/DLWorkspace/YTung/src/ClusterBootstrap/deploy/services/cvat/cvat_backend.yaml
kubectl apply -f /home/dlwsadmin/DLWorkspace/YTung/src/ClusterBootstrap/deploy/services/cvat/cvat_backend.yaml

read_dir(){
    for file in `ls -a $1`
    do
        if [ -d $1"/"$file ]
        then
            if [[ $file != '.' && $file != '..' ]]
            then
                read_dir $1"/"$file
            fi
        else
            if [[ $file == *.yaml ]] && [ $file != "function.yaml" ]
            then
              kubectl apply -f $1"/"$file
            fi
        fi
    done
}
read_dir serverless/