# Copyright (C) 2020 Apulis Technology Inc.
#
# SPDX-License-Identifier: MIT

import argparse
import torch
import numpy as np
from torchvision import transforms
import cv2
import os
import logging
import time

import pycocotools.mask as mask_util
from caffe2.python import workspace

from core.config import assert_and_infer_cfg
from core.config import cfg
from core.config import merge_cfg_from_file
from utils.io import cache_url
from utils.timer import Timer
from utils.colormap import colormap
import core.test_engine as infer_engine
import datasets.dummy_datasets as dummy_datasets
import utils.c2 as c2_utils
import utils.logging
import utils.vis as vis_utils

c2_utils.import_detectron_ops()
cv2.ocl.setUseOpenCL(False)

class ModelHandler:
    def __init__(self):
        # Caffe and Logging Initialization
        workspace.GlobalInit(['caffe2', '--caffe2_log_level=0'])
        utils.logging.setup_logging(__name__)
        
        # Setup device
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        torch.backends.cudnn.deterministic = True
        base_dir = os.path.abspath("/opt/nuclio/seg_every_thing")
        
        model_path = os.path.join(base_dir, "models/model_hardhat.pkl")
        state_dict = torch.load(model_path, map_location=self.device)
        self.model = infer_engine.initialize_model_from_cfg(model_path)
        self.model.to(self.device)
        
        config_path = os.path.join(base_dir, "configs/hardhat_uniform/eval_sw/runtest_clsbox_2_layer_mlp_nograd.yaml")
        merge_cfg_from_file(config_path)
        cfg.NUM_GPUS = 1 if torch.cuda.is_available() else 0
        self.config = cfg
        
    def handle(self, image, threshold=0.9):
        logger.info('Processing image.')
        image = image.to(self.device)        
        timers = defaultdict(Timer)
        t = time.time()
        with c2_utils.NamedCudaScope(0):
            cls_boxes, cls_segms, cls_keyps = infer_engine.im_detect_all(
                model, image, None, timers=timers
            )
        logger.info('Inference time: {:.3f}s'.format(time.time() - t))
        for k, v in timers.items():
            logger.info(' | {}: {:.3f}s'.format(k, v.average_time))            
        if isinstance(cls_boxes, list):
        boxes, segms, keypoints, classes = vis_utils.convert_from_cls_format(
            cls_boxes, cls_segms, cls_keyps)        
        infer_result = {
            'boxes': boxes,
            'segms': segms,
            'keypoints': keypoints,
            'classes': classes
        }
        if self.device == 'cuda':
            torch.cuda.empty_cache()
        return infer_result


