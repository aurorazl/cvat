# Generated by Django 2.2.4 on 2019-10-23 10:25

import os
import re
import shutil
import glob
import logging
import sys
import traceback
import itertools
import multiprocessing
import time

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings

from cvat.apps.engine.media_extractors import (VideoReader, ArchiveReader, ZipReader,
    PdfReader , ImageListReader, Mpeg4ChunkWriter,
    ZipChunkWriter, ZipCompressedChunkWriter, get_mime)
from cvat.apps.engine.models import DataChoice

MIGRATION_THREAD_COUNT = 2

def fix_path(path):
        ind = path.find('.upload')
        if ind != -1:
            path = path[ind + len('.upload') + 1:]
        return path

def get_frame_step(frame_filter):
    match = re.search("step\s*=\s*([1-9]\d*)", frame_filter)
    return int(match.group(1)) if match else 1

def get_task_on_disk():
    folders = [os.path.relpath(f, settings.DATA_ROOT)
        for f in glob.glob(os.path.join(settings.DATA_ROOT, '*'), recursive=False)]

    return set(int(f) for f in folders if f.isdigit())

def get_frame_path(task_data_dir, frame):
    d1 = str(int(frame) // 10000)
    d2 = str(int(frame) // 100)
    path = os.path.join(task_data_dir, d1, d2,
        str(frame) + '.jpg')

    return path

def slice_by_size(frames, size):
    it = itertools.islice(frames, 0, None)
    frames = list(itertools.islice(it, 0, size , 1))
    while frames:
        yield frames
        frames = list(itertools.islice(it, 0, size, 1))

def migrate_task_data(db_task_id, db_data_id, original_video, original_images, size, start_frame,
    stop_frame, frame_filter, image_quality, chunk_size, return_dict):
    try:
        db_data_dir = os.path.join(settings.MEDIA_DATA_ROOT, str(db_data_id))
        compressed_cache_dir = os.path.join(db_data_dir, 'compressed')
        original_cache_dir = os.path.join(db_data_dir, 'original')
        old_db_task_dir = os.path.join(settings.DATA_ROOT, str(db_task_id))
        old_task_data_dir = os.path.join(old_db_task_dir, 'data')
        if os.path.exists(old_task_data_dir) and size != 0:
            if original_video:
                if os.path.exists(original_video):
                    reader = VideoReader([original_video], get_frame_step(frame_filter), start_frame, stop_frame)
                    original_chunk_writer = Mpeg4ChunkWriter(100)
                    compressed_chunk_writer = ZipCompressedChunkWriter(image_quality)

                    for chunk_idx, chunk_images in enumerate(reader.slice_by_size(chunk_size)):
                        original_chunk_path = os.path.join(original_cache_dir, '{}.mp4'.format(chunk_idx))
                        original_chunk_writer.save_as_chunk(chunk_images, original_chunk_path)

                        compressed_chunk_path = os.path.join(compressed_cache_dir, '{}.zip'.format(chunk_idx))
                        compressed_chunk_writer.save_as_chunk(chunk_images, compressed_chunk_path)

                    reader.save_preview(os.path.join(db_data_dir, 'preview.jpeg'))
                else:
                    original_chunk_writer = ZipChunkWriter(100)
                    for chunk_idx, chunk_image_ids in enumerate(slice_by_size(range(size), chunk_size)):
                        chunk_images = []
                        for image_id in chunk_image_ids:
                            image_path = get_frame_path(old_task_data_dir, image_id)
                            chunk_images.append((image_path, image_path))

                        original_chunk_path = os.path.join(original_cache_dir, '{}.zip'.format(chunk_idx))
                        original_chunk_writer.save_as_chunk(chunk_images, original_chunk_path)

                        compressed_chunk_path = os.path.join(compressed_cache_dir, '{}.zip'.format(chunk_idx))
                        os.symlink(original_chunk_path, compressed_chunk_path)
                        shutil.copyfile(get_frame_path(old_task_data_dir, image_id), os.path.join(db_data_dir, 'preview.jpeg'))
            else:
                reader = None
                if os.path.exists(original_images[0]): # task created from images
                    reader = ImageListReader(original_images)
                else: # task created from archive or pdf
                    archives = []
                    pdfs = []
                    zips = []
                    for p in glob.iglob(os.path.join(db_data_dir, 'raw', '**', '*'), recursive=True):
                        mime_type = get_mime(p)
                        if mime_type == 'archive':
                            archives.append(p)
                        elif mime_type == 'pdf':
                            pdfs.append(p)
                        elif mime_type == 'zip':
                            zips.append(p)
                    if archives:
                        reader = ArchiveReader(archives, get_frame_step(frame_filter), start_frame, stop_frame)
                    elif zips:
                        reader = ZipReader(archives, get_frame_step(frame_filter), start_frame, stop_frame)
                    elif pdfs:
                        reader = PdfReader(pdfs, get_frame_step(frame_filter), start_frame, stop_frame)

                if not reader:
                    original_chunk_writer = ZipChunkWriter(100)
                    for chunk_idx, chunk_image_ids in enumerate(slice_by_size(range(size), chunk_size)):
                        chunk_images = []
                        for image_id in chunk_image_ids:
                            image_path = get_frame_path(old_task_data_dir, image_id)
                            chunk_images.append((image_path, image_path))

                        original_chunk_path = os.path.join(original_cache_dir, '{}.zip'.format(chunk_idx))
                        original_chunk_writer.save_as_chunk(chunk_images, original_chunk_path)

                        compressed_chunk_path = os.path.join(compressed_cache_dir, '{}.zip'.format(chunk_idx))
                        os.symlink(original_chunk_path, compressed_chunk_path)
                        shutil.copyfile(get_frame_path(old_task_data_dir, image_id), os.path.join(db_data_dir, 'preview.jpeg'))
                else:
                    original_chunk_writer = ZipChunkWriter(100)
                    compressed_chunk_writer = ZipCompressedChunkWriter(image_quality)

                    for chunk_idx, chunk_images in enumerate(reader.slice_by_size(chunk_size)):
                        compressed_chunk_path = os.path.join(compressed_cache_dir, '{}.zip'.format(chunk_idx))
                        compressed_chunk_writer.save_as_chunk(chunk_images, compressed_chunk_path)

                        original_chunk_path = os.path.join(original_cache_dir, '{}.zip'.format(chunk_idx))
                        original_chunk_writer.save_as_chunk(chunk_images, original_chunk_path)

                    reader.save_preview(os.path.join(db_data_dir, 'preview.jpeg'))
            shutil.rmtree(old_db_task_dir)
        return_dict[db_task_id] = (True, '')
    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        return_dict[db_task_id] = (False, str(e))
    return 0

def migrate_task_schema(db_task, Data, log):
    log.info('Start schema migration of task ID {}.'.format(db_task.id))
    try:
        # create folders
        new_task_dir = os.path.join(settings.TASKS_ROOT, str(db_task.id))
        os.makedirs(new_task_dir, exist_ok=True)
        os.makedirs(os.path.join(new_task_dir, 'artifacts'),  exist_ok=True)
        new_task_logs_dir = os.path.join(new_task_dir, 'logs')
        os.makedirs(new_task_logs_dir,  exist_ok=True)

        # create Data object
        db_data = Data.objects.create(
            size=db_task.size,
            image_quality=db_task.image_quality,
            start_frame=db_task.start_frame,
            stop_frame=db_task.stop_frame,
            frame_filter=db_task.frame_filter,
            compressed_chunk_type = DataChoice.IMAGESET,
            original_chunk_type = DataChoice.VIDEO if db_task.mode == 'interpolation' else DataChoice.IMAGESET,
        )
        db_data.save()

        db_task.data = db_data

        db_data_dir = os.path.join(settings.MEDIA_DATA_ROOT, str(db_data.id))
        os.makedirs(db_data_dir, exist_ok=True)
        compressed_cache_dir = os.path.join(db_data_dir, 'compressed')
        os.makedirs(compressed_cache_dir, exist_ok=True)

        original_cache_dir = os.path.join(db_data_dir, 'original')
        os.makedirs(original_cache_dir, exist_ok=True)

        old_db_task_dir = os.path.join(settings.DATA_ROOT, str(db_task.id))

        # move logs
        for log_file in ('task.log', 'client.log'):
            task_log_file = os.path.join(old_db_task_dir, log_file)
            if os.path.isfile(task_log_file):
                shutil.move(task_log_file, new_task_logs_dir)

        if hasattr(db_task, 'video'):
            db_task.video.data = db_data
            db_task.video.path = fix_path(db_task.video.path)
            db_task.video.save()

        for db_image in db_task.image_set.all():
            db_image.data = db_data
            db_image.path = fix_path(db_image.path)
            db_image.save()

        old_raw_dir = os.path.join(old_db_task_dir, '.upload')
        new_raw_dir = os.path.join(db_data_dir, 'raw')

        for client_file in db_task.clientfile_set.all():
            client_file.file = client_file.file.path.replace(old_raw_dir, new_raw_dir)
            client_file.save()

        for server_file in db_task.serverfile_set.all():
            server_file.file = server_file.file.replace(old_raw_dir, new_raw_dir)
            server_file.save()

        for remote_file in db_task.remotefile_set.all():
            remote_file.file = remote_file.file.replace(old_raw_dir, new_raw_dir)
            remote_file.save()

        db_task.save()

        #move old raw data
        if os.path.exists(old_raw_dir):
            shutil.move(old_raw_dir, new_raw_dir)

        return (db_task.id, db_data.id)

    except Exception as e:
        log.error('Cannot migrate schema for the task: {}'.format(db_task.id))
        log.error(str(e))
        traceback.print_exc(file=sys.stderr)

def create_data_objects(apps, schema_editor):
    migration_name = os.path.splitext(os.path.basename(__file__))[0]
    migration_log_file = '{}.log'.format(migration_name)
    stdout = sys.stdout
    stderr = sys.stderr
    # redirect all stdout to the file
    log_file_object = open(os.path.join(settings.MIGRATIONS_LOGS_ROOT, migration_log_file), 'w')
    sys.stdout = log_file_object
    sys.stderr = log_file_object

    log = logging.getLogger(migration_name)
    log.addHandler(logging.StreamHandler(stdout))
    log.addHandler(logging.StreamHandler(log_file_object))
    log.setLevel(logging.INFO)

    disk_tasks = get_task_on_disk()

    Task = apps.get_model('engine', 'Task')
    Data = apps.get_model('engine', 'Data')

    db_tasks = Task.objects
    task_count = db_tasks.count()
    log.info('\nStart schema migration...')
    migrated_db_tasks = []
    for counter, db_task in enumerate(db_tasks.all().iterator()):
        res = migrate_task_schema(db_task, Data, log)
        log.info('Schema migration for the task {} completed. Progress {}/{}'.format(db_task.id, counter+1, task_count))
        if res:
            migrated_db_tasks.append(res)

    log.info('\nSchema migration is finished...')
    log.info('\nStart data migration...')

    manager = multiprocessing.Manager()
    return_dict = manager.dict()

    def create_process(db_task_id, db_data_id):
        db_data = Data.objects.get(pk=db_data_id)
        db_data_dir = os.path.join(settings.MEDIA_DATA_ROOT, str(db_data_id))
        new_raw_dir = os.path.join(db_data_dir, 'raw')

        original_video = None
        original_images = None
        if hasattr(db_data, 'video'):
            original_video = os.path.join(new_raw_dir, db_data.video.path)
        else:
            original_images = [os.path.realpath(os.path.join(new_raw_dir, db_image.path)) for db_image in db_data.images.all()]

        args = (db_task_id, db_data_id, original_video, original_images, db_data.size,
            db_data.start_frame, db_data.stop_frame, db_data.frame_filter, db_data.image_quality, db_data.chunk_size, return_dict)

        return multiprocessing.Process(target=migrate_task_data, args=args)

    results = {}
    task_idx = 0
    while True:
        for res_idx in list(results.keys()):
            res = results[res_idx]
            if not res.is_alive():
                del results[res_idx]
                if res.exitcode == 0:
                    ret_code, message = return_dict[res_idx]
                    if ret_code:
                        counter = (task_idx - len(results))
                        progress = (100 * counter) / task_count
                        log.info('Data migration for the task {} completed. Progress: {:.02f}% | {}/{}.'.format(res_idx, progress, counter, task_count))
                    else:
                        log.error('Cannot migrate data for the task: {}'.format(res_idx))
                        log.error(str(message))
                    if res_idx in disk_tasks:
                        disk_tasks.remove(res_idx)
                else:
                    log.error('#Cannot migrate data for the task: {}'.format(res_idx))

        while task_idx < len(migrated_db_tasks) and len(results) < MIGRATION_THREAD_COUNT:
            log.info('Start data migration for the task {}, data ID {}'.format(migrated_db_tasks[task_idx][0], migrated_db_tasks[task_idx][1]))
            results[migrated_db_tasks[task_idx][0]] = create_process(*migrated_db_tasks[task_idx])
            results[migrated_db_tasks[task_idx][0]].start()
            task_idx += 1

        if len(results) == 0:
            break

        time.sleep(5)

    if disk_tasks:
        suspicious_tasks_dir = os.path.join(settings.DATA_ROOT, 'suspicious_tasks')
        os.makedirs(suspicious_tasks_dir, exist_ok=True)
        for tid in disk_tasks:
            suspicious_task_path = os.path.join(settings.DATA_ROOT, str(tid))
            try:
                shutil.move(suspicious_task_path, suspicious_tasks_dir)
            except Exception as e:
                log.error('Cannot move data for the suspicious task {}, \
                    that is not represented in the database.'.format(suspicious_task_path))
                log.error(str(e))

    # DL models migration
    if apps.is_installed('auto_annotation'):
        DLModel = apps.get_model('auto_annotation', 'AnnotationModel')

        for db_model in DLModel.objects.all():
            try:
                old_location = os.path.join(settings.BASE_DIR, 'models', str(db_model.id))
                new_location = os.path.join(settings.BASE_DIR, 'data', 'models', str(db_model.id))

                if os.path.isdir(old_location):
                    shutil.move(old_location, new_location)

                    db_model.model_file.name = db_model.model_file.name.replace(old_location, new_location)
                    db_model.weights_file.name = db_model.weights_file.name.replace(old_location, new_location)
                    db_model.labelmap_file.name = db_model.labelmap_file.name.replace(old_location, new_location)
                    db_model.interpretation_file.name = db_model.interpretation_file.name.replace(old_location, new_location)

                    db_model.save()
            except Exception as e:
                log.error('Cannot migrate data for the DL model: {}'.format(db_model.id))
                log.error(str(e))

    log_file_object.close()
    sys.stdout = stdout
    sys.stderr = stderr

class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0023_auto_20200113_1323'),
    ]

    operations = [
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chunk_size', models.PositiveIntegerField(default=36)),
                ('size', models.PositiveIntegerField(default=0)),
                ('image_quality', models.PositiveSmallIntegerField(default=50)),
                ('start_frame', models.PositiveIntegerField(default=0)),
                ('stop_frame', models.PositiveIntegerField(default=0)),
                ('frame_filter', models.CharField(blank=True, default='', max_length=256)),
                ('compressed_chunk_type', models.CharField(choices=[('video', 'VIDEO'), ('imageset', 'IMAGESET'), ('list', 'LIST')], default=DataChoice('imageset'), max_length=32)),
                ('original_chunk_type', models.CharField(choices=[('video', 'VIDEO'), ('imageset', 'IMAGESET'), ('list', 'LIST')], default=DataChoice('imageset'), max_length=32)),
            ],
            options={
                'default_permissions': (),
            },
        ),
        migrations.AddField(
            model_name='task',
            name='data',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='engine.Data'),
        ),
        migrations.AddField(
            model_name='image',
            name='data',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='images', to='engine.Data'),
        ),
        migrations.AddField(
            model_name='video',
            name='data',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='video', to='engine.Data'),
        ),
        migrations.AddField(
            model_name='clientfile',
            name='data',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='client_files', to='engine.Data'),
        ),
        migrations.AddField(
            model_name='remotefile',
            name='data',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='remote_files', to='engine.Data'),
        ),
        migrations.AddField(
            model_name='serverfile',
            name='data',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='server_files', to='engine.Data'),
        ),
        migrations.RunPython(
            code=create_data_objects
        ),
        migrations.RemoveField(
            model_name='image',
            name='task',
        ),
        migrations.RemoveField(
            model_name='remotefile',
            name='task',
        ),
        migrations.RemoveField(
            model_name='serverfile',
            name='task',
        ),
        migrations.RemoveField(
            model_name='task',
            name='frame_filter',
        ),
        migrations.RemoveField(
            model_name='task',
            name='image_quality',
        ),
        migrations.RemoveField(
            model_name='task',
            name='size',
        ),
        migrations.RemoveField(
            model_name='task',
            name='start_frame',
        ),
        migrations.RemoveField(
            model_name='task',
            name='stop_frame',
        ),
        migrations.RemoveField(
            model_name='video',
            name='task',
        ),
        migrations.AlterField(
            model_name='image',
            name='path',
            field=models.CharField(default='', max_length=1024),
        ),
        migrations.AlterField(
            model_name='video',
            name='path',
            field=models.CharField(default='', max_length=1024),
        ),
        migrations.AlterUniqueTogether(
            name='clientfile',
            unique_together={('data', 'file')},
        ),
        migrations.RemoveField(
            model_name='clientfile',
            name='task',
        ),
    ]
