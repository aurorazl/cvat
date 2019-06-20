/*
 * Copyright (C) 2018 Intel Corporation
 * SPDX-License-Identifier: MIT
 */


module.exports = {
    plugins: [],
    recurseDepth: 10,
    source: {
        includePattern: '.+\\.js(doc|x)?$',
        excludePattern: '(^|\\/|\\\\)_',
    },
    sourceType: 'module',
    tags: {
        allowUnknownTags: false,
        dictionaries: ['jsdoc', 'closure'],
    },
    templates: {
        cleverLinks: false,
        monospaceLinks: false,
        default: {
            outputSourceFiles: false,
        },
    },
};
