/*
* Copyright (C) 2020 Intel Corporation
* SPDX-License-Identifier: MIT
*/

/* global
    require:false
*/

const serverProxy = require('./server-proxy');
const { ArgumentError } = require('./exceptions');
const { Task } = require('./session');
const MLModel = require('./ml-model');
const { RQStatus } = require('./enums');
const i18next = require('i18next').default;

class LambdaManager {
    constructor() {
        this.listening = {};
        this.cachedList = null;
    }

    async list() {
        if (Array.isArray(this.cachedList)) {
            return [...this.cachedList];
        }

        const result = await serverProxy.lambda.list();
        const models = [];

        for (const model of result) {
            models.push(new MLModel({
                ...model,
                type: model.kind,
            }));
        }

        this.cachedList = models;
        return models;
    }

    async run(task, model, args) {
        if (!(task instanceof Task)) {
            throw new ArgumentError(
                i18next.t('Argument task is expected to be an instance of Task class, but got ${typeof (task)}', {typeoftask: `${typeof (task)}`}),
            );
        }

        if (!(model instanceof MLModel)) {
            throw new ArgumentError(
                i18next.t('Argument model is expected to be an instance of MLModel class, but got ${typeof (model)}', {typeofmodel: `${typeof (model)}`}),
            );
        }

        if (args && typeof (args) !== 'object') {
            throw new ArgumentError(
                i18next.t('Argument args is expected to be an object, but got ${typeof (model)}', {typeofmodel: `${typeof (model)}`}),
            );
        }

        const body = args;
        body.task = task.id;
        body.function = model.id;

        const result = await serverProxy.lambda.run(body);
        return result.id;
    }

    async call(task, model, args) {
        const body = args;
        body.task = task.id;
        const result = await serverProxy.lambda.call(model.id, body);
        return result;
    }

    async requests() {
        const result = await serverProxy.lambda.requests();
        return result.filter((request) => ['queued', 'started'].includes(request.status));
    }

    async cancel(requestID) {
        if (typeof (requestID) !== 'string') {
            throw new ArgumentError(i18next.t('Request id argument is required to be a string. But got ${requestID}', {requestID: `${requestID}`}));
        }

        if (this.listening[requestID]) {
            clearTimeout(this.listening[requestID].timeout);
            delete this.listening[requestID];
        }
        await serverProxy.lambda.cancel(requestID);
    }

    async listen(requestID, onUpdate) {
        const timeoutCallback = async () => {
            try {
                this.listening[requestID].timeout = null;
                const response = await serverProxy.lambda.status(requestID);

                if (response.status === RQStatus.QUEUED || response.status === RQStatus.STARTED) {
                    onUpdate(response.status, response.progress || 0);
                    this.listening[requestID].timeout = setTimeout(timeoutCallback, 2000);
                } else {
                    if (response.status === RQStatus.FINISHED) {
                        onUpdate(response.status, response.progress || 100);
                    } else {
                        onUpdate(response.status, response.progress || 0, response.exc_info || '');
                    }

                    delete this.listening[requestID];
                }
            } catch (error) {
                onUpdate(RQStatus.UNKNOWN, 0, i18next.t('Could not get a status of the request ${requestID}. ${error.toString()}', {requestID: `${requestID}`, errortoString: `${error.toString()}`}));
            }
        };

        this.listening[requestID] = {
            onUpdate,
            timeout: setTimeout(timeoutCallback, 2000),
        };
    }
}

module.exports = new LambdaManager();
