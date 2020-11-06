#!/bin/bash

harbor_prefix=$1
k8s_version=v1.18.2
k8s_url=k8s.gcr.io
k8s_images=(
    $k8s_url/kube-proxy:$k8s_version
    $k8s_url/kube-apiserver:$k8s_version
    $k8s_url/kube-controller-manager:$k8s_version
    $k8s_url/kube-scheduler:$k8s_version
    $k8s_url/pause:3.2
    $k8s_url/etcd:3.4.3-0
    $k8s_url/coredns:1.6.7
    plndr/kube-vip:0.1.7
  )
for image in ${k8s_images[@]};
    do
        docker pull $harbor_prefix$image
        docker tag $harbor_prefix$image $image
    done

kubeadm init
