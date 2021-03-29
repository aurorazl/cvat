# Copyright (C) 2018 Intel Corporation
#
# SPDX-License-Identifier: MIT

import os
import os.path as osp
import zipfile
from collections import OrderedDict
from glob import glob
from tempfile import TemporaryDirectory

from cvat.apps.dataset_manager.bindings import match_dm_item
from cvat.apps.dataset_manager.util import make_zip_archive
from cvat.apps.engine.frame_provider import FrameProvider
from datumaro.components.extractor import DatasetItem
from datumaro.util.image import save_image

from .registry import exporter, importer
from django.utils.translation import gettext
from django.conf import settings
from cvat.apps.engine.utils import get_dataset_path_and_format_and_tag
from cvat.apps.dataset_manager.bindings import CvatTaskDataExtractor
from datumaro.components.project import Dataset
from .registry import dm_env

def dump_annotation(directory,task_data):
    attr_index = {}
    rel_path, format, tag = get_dataset_path_and_format_and_tag(task_data._db_task.data.dataset_id)
    outpath = osp.join(settings.DATASET_MANAGER_STORAGE_PATH,rel_path, settings.DATASET_MANAGER_PLATFORM_PUSH_SUB_PATH)
    if not os.path.exists(outpath):
        os.makedirs(outpath)
    for frame_annotation in task_data.group_by_frame(include_empty=False):
        attributes = []
        old_file_name = frame_annotation.full_path
        for tag in frame_annotation.tags:
            for attr in tag.attributes:
                attributes.append(attr.value)
        if not attributes:
            continue
        text = attributes[0]
        attr_index.setdefault(text,-1)
        attr_index[text]+=1
        with open(osp.join(directory,"{}_{}.txt".format(text,attr_index[text])),"w") as f:
            f.write(text)
        output_file_name = osp.join(outpath,"{}_{}{}".format(text,attr_index[text],os.path.splitext(old_file_name)[-1]))
        if not osp.exists(output_file_name) and osp.exists(old_file_name):
            os.symlink(old_file_name,output_file_name)


def dump_data_as_ocr_format(dst_file, task_data, save_images=False):
    with TemporaryDirectory() as temp_dir:
        if save_images:
            ext = ''
            if task_data.meta['task']['mode'] == 'interpolation':
                ext = FrameProvider.VIDEO_FRAME_EXT

            img_dir = osp.join(temp_dir, 'images')
            frame_provider = FrameProvider(task_data.db_task.data)
            frames = frame_provider.get_frames(
                frame_provider.Quality.ORIGINAL,
                frame_provider.Type.BUFFER)
            for frame_id, (frame_data, _) in enumerate(frames):
                frame_name = task_data.frame_info[frame_id]['path']
                img_path = osp.join(img_dir, frame_name + ext)
                os.makedirs(osp.dirname(img_path), exist_ok=True)
                with open(img_path, 'wb') as f:
                    f.write(frame_data.getvalue())
        dump_annotation(temp_dir, task_data)
        make_zip_archive(temp_dir, dst_file)

@exporter(name='OCR RECOGNITION', ext='ZIP', version='1.0')
def _export_re(dst_file, task_data, save_images=False):
    dump_data_as_ocr_format(dst_file, task_data, save_images=save_images)

@exporter(name='OCR DETECTION', ext='ZIP', version='1.0')
def _export_de(dst_file, task_data, save_images=False):
    extractor = CvatTaskDataExtractor(task_data, include_images=save_images)
    extractor = Dataset.from_extractors(extractor)  # apply lazy transforms
    with TemporaryDirectory() as temp_dir:
        dm_env.converters.get('coco_instances').convert(extractor,
                                                        save_dir=temp_dir, save_images=save_images)
        make_zip_archive(temp_dir, dst_file)
