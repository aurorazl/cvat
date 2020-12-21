# Copyright (C) 2018 Intel Corporation
#
# SPDX-License-Identifier: MIT

from functools import update_wrapper
from django.utils.translation import gettext
__plugins = {}


def add_plugin(name, function, order, exc_ok = False):
    if order not in ["before", "after"]:
        raise Exception(gettext("Order may be 'before' or 'after' only. Got {}.").format(order))

    if not callable(function):
        raise Exception(gettext("'function' argument should be a callable element"))

    if not isinstance(name, str):
        raise Exception(gettext("'name' argument should be a string. Got {}.").format(type(name)))

    if name not in __plugins:
        __plugins[name] = {
            "before": [],
            "after": []
        }

    if function in __plugins[name][order]:
        raise Exception(gettext("plugin has been attached already"))

    __plugins[name][order].append(function)

    function.exc_ok = exc_ok


def remove_plugin(name, function):
    if name in __plugins:
        if function in __plugins[name]["before"]:
            __plugins[name]["before"].remove(function)
            del function.exc_ok
        if function in __plugins[name]["after"]:
            __plugins[name]["after"].remove(function)
            del function.exc_ok


def plugin_decorator(function_to_decorate):
    name = function_to_decorate.__name__

    def function_wrapper(*args, **kwargs):
        if name in __plugins:
            for wrapper in __plugins[name]["before"]:
                try:
                    wrapper(*args, **kwargs)
                except Exception as ex:
                    if not wrapper.exc_ok:
                        raise ex

        result = function_to_decorate(*args, **kwargs)

        if name in __plugins:
            for wrapper in __plugins[name]["after"]:
                try:
                    wrapper(*args, **kwargs)
                except Exception as ex:
                    if not wrapper.exc_ok:
                        raise ex

        return result

    # Copy meta info about wrapped function to wrapper function
    update_wrapper(function_wrapper, function_to_decorate)
    return function_wrapper
