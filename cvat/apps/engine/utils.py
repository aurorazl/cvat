# Copyright (C) 2020 Intel Corporation
#
# SPDX-License-Identifier: MIT

import ast
from collections import namedtuple
import importlib
import sys
import traceback
import subprocess
import os
import requests
from django.core.exceptions import ValidationError
from django.conf import settings
from django.utils import translation
from .log import clogger, slogger

Import = namedtuple("Import", ["module", "name", "alias"])

def parse_imports(source_code: str):
    root = ast.parse(source_code)

    for node in ast.iter_child_nodes(root):
        if isinstance(node, ast.Import):
            module = []
        elif isinstance(node, ast.ImportFrom):
            module = node.module
        else:
            continue

        for n in node.names:
            yield Import(module, n.name, n.asname)

def import_modules(source_code: str):
    results = {}
    imports = parse_imports(source_code)
    for import_ in imports:
        module = import_.module if import_.module else import_.name
        loaded_module = importlib.import_module(module)

        if not import_.name == module:
            loaded_module = getattr(loaded_module, import_.name)

        if import_.alias:
            results[import_.alias] = loaded_module
        else:
            results[import_.name] = loaded_module

    return results

class InterpreterError(Exception):
    pass

def execute_python_code(source_code, global_vars=None, local_vars=None):
    try:
        exec(source_code, global_vars, local_vars)
    except SyntaxError as err:
        error_class = err.__class__.__name__
        details = err.args[0]
        line_number = err.lineno
        raise InterpreterError("{} at line {}: {}".format(error_class, line_number, details))
    except AssertionError as err:
        # AssertionError doesn't contain any args and line number
        error_class = err.__class__.__name__
        raise InterpreterError("{}".format(error_class))
    except Exception as err:
        error_class = err.__class__.__name__
        details = err.args[0]
        _, _, tb = sys.exc_info()
        line_number = traceback.extract_tb(tb)[-1][1]
        raise InterpreterError("{} at line {}: {}".format(error_class, line_number, details))

def av_scan_paths(*paths):
    if 'yes' == os.environ.get('CLAM_AV'):
        command = ['clamscan', '--no-summary', '-i', '-o']
        command.extend(paths)
        res = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode:
            raise ValidationError(res.stdout)

def setup_language_for_uid_on_thread(uid):
    user_language = settings.GLOBAL_LANGUAGE_CACHE.get(uid)
    if user_language:
        translation.activate(user_language)

def setup_language(user_language):
    if user_language:
        slogger.glob.info("set current thread to language: {}".format(user_language))
        translation.activate(user_language)


def get_dataset_path_and_format_and_tag(dataset_id):
    dataset_manager_url = settings.DATASET_MANAGER_URL
    token = settings.AIART_TOKEN
    if isinstance(token,bytes):
        token = token.decode()
    response = requests.get(url="{}/api/cv_datasets/id/{}".format(dataset_manager_url,dataset_id),headers={"Authorization": "Bearer " + token},timeout=5)
    response.raise_for_status()
    assert "storagePath" in response.json()["data"]
    assert "cvDatasetFormat" in response.json()["data"]
    assert "tag" in response.json()["data"]
    bind_dataset(dataset_id)
    return response.json()["data"]["storagePath"],response.json()["data"]["cvDatasetFormat"],response.json()["data"]["tag"]

def dataset_tag_had_change(dataset_id,saved_tag):
    rel_path,format,tag = get_dataset_path_and_format_and_tag(dataset_id)
    if saved_tag and tag != saved_tag:
        slogger.glob.info("dataset {} change from {} to {}".format(dataset_id,saved_tag,tag))
        return True
    return False

def bind_dataset(dataset_id):
    dataset_manager_url = settings.DATASET_MANAGER_URL
    token = settings.AIART_TOKEN
    response = requests.post(url="{}/api/cv_datasets/id/{}/bind".format(dataset_manager_url, dataset_id),
                            headers={"Authorization": "Bearer " + token}, timeout=5)
    response.raise_for_status()

def unbind_dataset(dataset_id,labels):
    dataset_manager_url = settings.DATASET_MANAGER_URL
    token = settings.AIART_TOKEN
    response = requests.post(url="{}/api/cv_datasets/id/{}/unbind".format(dataset_manager_url, dataset_id),
                            headers={"Authorization": "Bearer " + token}, timeout=5,json={"labelList":labels})
    response.raise_for_status()
