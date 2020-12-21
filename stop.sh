#!/bin/bash

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
              kubectl delete -f $1"/"$file
            fi
        fi
    done
}
read_dir serverless/