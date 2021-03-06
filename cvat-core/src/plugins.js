// Copyright (C) 2019-2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

(() => {
    const { PluginError } = require('./exceptions');
    const i18next = require('i18next').default;

    const plugins = [];
    class PluginRegistry {
        static async apiWrapper(wrappedFunc, ...args) {
            // I have to optimize the wrapper
            const pluginList = await PluginRegistry.list();
            for (const plugin of pluginList) {
                const pluginDecorators = plugin.functions.filter((obj) => obj.callback === wrappedFunc)[0];
                if (pluginDecorators && pluginDecorators.enter) {
                    try {
                        await pluginDecorators.enter.call(this, plugin, ...args);
                    } catch (exception) {
                        if (exception instanceof PluginError) {
                            throw exception;
                        } else {
                            throw new PluginError(i18next.t('Exception in plugin ${plugin.name}: ${exception.toString()}'), {pluginname: `${plugin.name}`, exceptiontoString: `${exception.toString()}`});
                        }
                    }
                }
            }

            let result = await wrappedFunc.implementation.call(this, ...args);

            for (const plugin of pluginList) {
                const pluginDecorators = plugin.functions.filter((obj) => obj.callback === wrappedFunc)[0];
                if (pluginDecorators && pluginDecorators.leave) {
                    try {
                        result = await pluginDecorators.leave.call(this, plugin, result, ...args);
                    } catch (exception) {
                        if (exception instanceof PluginError) {
                            throw exception;
                        } else {
                            throw new PluginError(i18next.t('Exception in plugin ${plugin.name}: ${exception.toString()}'), {pluginname: `${plugin.name}`, exceptiontoString: `${exception.toString()}`});
                        }
                    }
                }
            }

            return result;
        }

        // Called with cvat context
        static async register(plug) {
            const functions = [];

            if (typeof (plug) !== 'object') {
                throw new PluginError(i18next.t('Plugin should be an object, but got "${typeof (plug)}"'), {typeofplug: `${typeof (plug)}`});
            }

            if (!('name' in plug) || typeof (plug.name) !== 'string') {
                throw new PluginError(i18next.t('Plugin must contain a "name" field and it must be a string'));
            }

            if (!('description' in plug) || typeof (plug.description) !== 'string') {
                throw new PluginError(i18next.t('Plugin must contain a "description" field and it must be a string'));
            }

            if ('functions' in plug) {
                throw new PluginError(i18next.t('Plugin must not contain a "functions" field'));
            }

            function traverse(plugin, api) {
                const decorator = {};
                for (const key in plugin) {
                    if (Object.prototype.hasOwnProperty.call(plugin, key)) {
                        if (typeof plugin[key] === 'object') {
                            if (Object.prototype.hasOwnProperty.call(api, key)) {
                                traverse(plugin[key], api[key]);
                            }
                        } else if (
                            ['enter', 'leave'].includes(key)
                            && typeof api === 'function'
                            && typeof (plugin[key] === 'function')
                        ) {
                            decorator.callback = api;
                            decorator[key] = plugin[key];
                        }
                    }
                }

                if (Object.keys(decorator).length) {
                    functions.push(decorator);
                }
            }

            traverse(plug, { cvat: this });

            Object.defineProperty(plug, 'functions', {
                value: functions,
                writable: false,
            });

            plugins.push(plug);
        }

        static async list() {
            return plugins;
        }
    }

    module.exports = PluginRegistry;
})();
