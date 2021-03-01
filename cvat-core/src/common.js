// Copyright (C) 2019-2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

(() => {
    const { ArgumentError } = require('./exceptions');
    const i18next = require('i18next').default;

    function isBoolean(value) {
        return typeof value === 'boolean';
    }

    function isInteger(value) {
        return typeof value === 'number' && Number.isInteger(value);
    }

    // Called with specific Enum context
    function isEnum(value) {
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                if (this[key] === value) {
                    return true;
                }
            }
        }

        return false;
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function checkFilter(filter, fields) {
        for (const prop in filter) {
            if (Object.prototype.hasOwnProperty.call(filter, prop)) {
                if (!(prop in fields)) {
                    throw new ArgumentError(i18next.t('Unsupported filter property has been recieved: "${prop}"', {prop: `${prop}`}));
                } else if (!fields[prop](filter[prop])) {
                    throw new ArgumentError(i18next.t('Received filter property "${prop}" is not satisfied for checker', {prop: `${prop}`}));
                }
            }
        }
    }

    function checkObjectType(name, value, type, instance) {
        if (type) {
            if (typeof value !== type) {
                // specific case for integers which aren't native type in JS
                if (type === 'integer' && Number.isInteger(value)) {
                    return true;
                }

                throw new ArgumentError(i18next.t('"${name}" is expected to be "${type}", but "${typeof (value)}" has been got.', {name: `${name}`, type: `${type}`, tyepofvalue: `${typeof (value)}`}));
            }
        } else if (instance) {
            if (!(value instanceof instance)) {
                if (value !== undefined) {
                    throw new ArgumentError(
                        i18next.t('"${name}" is expected to be ${instance.name}, but "${value.constructor.name}" has been got', {name: `${name}`, instancename: `${instance.name}`, valueconstructorname: `${value.constructor.name}`}),
                    );
                }

                throw new ArgumentError(i18next.t('"${name}" is expected to be ${instance.name}, but "undefined" has been got.', {name: `${name}`, instancename: `${instance.name}`}));
            }
        }

        return true;
    }

    module.exports = {
        isBoolean,
        isInteger,
        isEnum,
        isString,
        checkFilter,
        checkObjectType,
    };
})();
