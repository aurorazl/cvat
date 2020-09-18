// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import i18n from "i18next";

export interface Attribute {
    id: number;
    name: string;
    input_type: string;
    mutable: boolean;
    values: string[];
}

export interface Label {
    name: string;
    color: string;
    id: number;
    attributes: Attribute[];
}

let id = 0;

function validateParsedAttribute(attr: Attribute): void {
    if (typeof (attr.name) !== 'string') {
        throw new Error(i18n.t('Type of attribute name must be a string. Got value ${attr.name}').replace('${attr.name}', `${attr.name}`));
    }

    if (!['number', 'undefined'].includes(typeof (attr.id))) {
        throw new Error(i18n.t('Attribute: "${attr.name}". Type of attribute id must be a number or undefined. Got value ${attr.id}').replace('${attr.name}', `${attr.name}`).replace('${attr.id}', `${attr.id}`));
    }

    if (!['checkbox', 'number', 'text', 'radio', 'select'].includes((attr.input_type || '').toLowerCase())) {
        throw new Error(i18n.t('Attribute: "${attr.name}". Unknown input type: ${attr.input_type}').replace('${attr.name}', `${attr.name}`).replace('${attr.input_type}', `${attr.input_type}`));
    }

    if (typeof (attr.mutable) !== 'boolean') {
        throw new Error(i18n.t('Attribute: "${attr.name}". Mutable flag must be a boolean value. Got value ${attr.mutable}').replace('${attr.name}', `${attr.name}`).replace('${attr.mutable}', `${attr.mutable}`));
    }

    if (!Array.isArray(attr.values)) {
        throw new Error(i18n.t('Attribute: "${attr.name}". Attribute values must be an array. Got type ${typeof (attr.values)}').replace('${attr.name}', `${attr.name}`).replace('${attr.values}', `${attr.values}`));
    }

    if (!attr.values.length) {
        throw new Error(i18n.t('Attribute: "${attr.name}". Attribute values array mustn\'t be empty').replace('${attr.name}', `${attr.name}`));
    }


    for (const value of attr.values) {
        if (typeof (value) !== 'string') {
            throw new Error(i18n.t('Attribute: "${attr.name}". Each value must be a string. Got value ${value}').replace('${attr.name}', `${attr.name}`).replace('${value}', `${value}`));
        }
    }
}

export function validateParsedLabel(label: Label): void {
    if (typeof (label.name) !== 'string') {
        throw new Error(i18n.t('Type of label name must be a string. Got value ${label.name}').replace('${label.name}', `${label.name}`));
    }

    if (!['number', 'undefined'].includes(typeof (label.id))) {
        throw new Error(i18n.t('Label "${label.name}". Type of label id must be only a number or undefined. Got value ${label.id}').replace('${label.name}', `${label.name}`).replace('${label.id}', `${label.id}`));
    }

    if (typeof (label.color) !== 'string') {
        throw new Error(i18n.t('Label "${label.name}". Label color must be a string. Got ${typeof (label.color)}').replace('${label.name}', `${label.name}`).replace('${label.color}', `${label.color}`));
    }

    if (!label.color.match(/^#[0-9a-f]{6}$|^$/)) {
        throw new Error(i18n.t('Label "${label.name}". Type of label color must be only a valid color string. Got value ${label.color}').replace('${label.name}', `${label.name}`).replace('${label.color}', `${label.color}`));
    }

    if (!Array.isArray(label.attributes)) {
        throw new Error(i18n.t('Label "${label.name}". attributes must be an array. Got type ${typeof (label.attributes)}').replace('${label.name}', `${label.name}`).replace('${typeof (label.attributes)}', `${typeof (label.attributes)}`));
    }

    for (const attr of label.attributes) {
        validateParsedAttribute(attr);
    }
}

export function idGenerator(): number {
    return --id;
}

export function equalArrayHead(arr1: string[], arr2: string[]): boolean {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}
