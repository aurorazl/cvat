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
