# Copyright (C) 2019-2020 Intel Corporation
#
# SPDX-License-Identifier: MIT

import os
import os.path as osp
import json
import tempfile
from datetime import timedelta

import django_rq
from django.utils import timezone

import cvat.apps.dataset_manager.task as task
from cvat.apps.engine.log import slogger
from cvat.apps.engine.models import Task,Label
from datumaro.cli.util import make_file_name
from datumaro.util import to_snake_case

from .formats.registry import EXPORT_FORMATS, IMPORT_FORMATS
from .util import current_function_name
from cvat.apps.dataset_manager.util import unzip_archive
from django.utils.translation import gettext
from cvat.apps.engine.utils import setup_language
from django.conf import settings
from cvat.apps.engine.utils import get_dataset_path_and_format_and_tag,unbind_dataset
import cvat.apps.dataset_manager as dm
from cvat.apps.engine.serializers import (
    LabeledDataSerializer,
)


_MODULE_NAME = __package__ + '.' + osp.splitext(osp.basename(__file__))[0]
def log_exception(logger=None, exc_info=True):
    if logger is None:
        logger = slogger
    logger.exception("[%s @ %s]: exception occurred" % \
            (_MODULE_NAME, current_function_name(2)),
        exc_info=exc_info)


def get_export_cache_dir(db_task):
    task_dir = osp.abspath(db_task.get_task_dirname())
    if osp.isdir(task_dir):
        return osp.join(task_dir, 'export_cache')
    else:
        raise Exception(gettext('Task dir {} does not exist').format(task_dir))

DEFAULT_CACHE_TTL = timedelta(hours=10)
CACHE_TTL = DEFAULT_CACHE_TTL


def export_task(task_id, dst_format, server_url=None, save_images=False,language=None):
    if language:
        setup_language(language)
    try:
        db_task = Task.objects.get(pk=task_id)

        cache_dir = get_export_cache_dir(db_task)

        exporter = EXPORT_FORMATS[dst_format]
        output_base = '%s_%s' % ('dataset' if save_images else 'annotations',
            make_file_name(to_snake_case(dst_format)))
        output_path = '%s.%s' % (output_base, exporter.EXT)
        output_path = osp.join(cache_dir, output_path)

        task_time = timezone.localtime(db_task.updated_date).timestamp()
        if not (osp.exists(output_path) and \
                task_time <= osp.getmtime(output_path)):
            os.makedirs(cache_dir, exist_ok=True)
            with tempfile.TemporaryDirectory(dir=cache_dir) as temp_dir:
                temp_file = osp.join(temp_dir, 'result')
                task.export_task(task_id, temp_file, dst_format,
                    server_url=server_url, save_images=save_images)
                os.replace(temp_file, output_path)

            archive_ctime = osp.getctime(output_path)
            scheduler = django_rq.get_scheduler()
            cleaning_job = scheduler.enqueue_in(time_delta=CACHE_TTL,
                func=clear_export_cache,
                task_id=task_id,
                file_path=output_path, file_ctime=archive_ctime)
            slogger.task[task_id].info(
                "The task '{}' is exported as '{}' at '{}' "
                "and available for downloading for the next {}. "
                "Export cache cleaning job is enqueued, id '{}'".format(
                db_task.name, dst_format, output_path, CACHE_TTL,
                cleaning_job.id))

        return output_path
    except Exception:
        log_exception(slogger.task[task_id])
        raise

def export_task_as_dataset(task_id, dst_format=None, server_url=None,language=None):
    return export_task(task_id, dst_format, server_url=server_url, save_images=True,language=language)

def export_task_annotations(task_id, dst_format=None, server_url=None,language=None):
    return export_task(task_id, dst_format, server_url=server_url, save_images=False,language=language)

def export_task_annotations_to_platform(task_id, dst_format=None, server_url=None,language=None,dataset_id=None):
    labels = []
    if language:
        setup_language(language)
    rel_path,format,tag = get_dataset_path_and_format_and_tag(dataset_id)
    if not dst_format:
        dst_format = format
    archive_path = export_task(task_id, dst_format, server_url=server_url, save_images=False)
    output_directory = os.path.join(settings.DATASET_MANAGER_STORAGE_PATH, rel_path,settings.DATASET_MANAGER_PLATFORM_PUSH_SUB_PATH)
    unzip_archive(archive_path, output_directory)

    db_task = Task.objects.get(pk=task_id)
    db_task.data.exported = 1
    db_task.data.save()
    # db_task.save()


    data = dm.task.get_task_data(task_id)
    serializer = LabeledDataSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        with open(os.path.join(output_directory,"platform.json"), 'w') as f:
            f.write(json.dumps(serializer.data))

    query = Label.objects.filter(task=db_task).all()
    for one in query:
        labels.append(one.name)
    unbind_dataset(dataset_id,labels)

def clear_export_cache(task_id, file_path, file_ctime):
    try:
        if osp.exists(file_path) and osp.getctime(file_path) == file_ctime:
            os.remove(file_path)
            slogger.task[task_id].info(
                "Export cache file '{}' successfully removed" \
                .format(file_path))
    except Exception:
        log_exception(slogger.task[task_id])
        raise


def get_export_formats():
    return list(EXPORT_FORMATS.values())

def get_import_formats():
    return list(IMPORT_FORMATS.values())

def get_all_formats():
    return {
        'importers': get_import_formats(),
        'exporters': get_export_formats(),
    }
