// Copyright (C) 2019-2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

(() => {
    const PluginRegistry = require('./plugins');
    const serverProxy = require('./server-proxy');
    const lambdaManager = require('./lambda-manager');
    const {
        isBoolean, isInteger, isEnum, isString, checkFilter,
    } = require('./common');

    const { TaskStatus, TaskMode } = require('./enums');

    const User = require('./user');
    const { AnnotationFormats } = require('./annotation-formats');
    const { ArgumentError } = require('./exceptions');
    const { Task } = require('./session');
    const i18next = require('i18next').default;
    const groupTrans = require('./utils/groupTrans');

    function attachUsers(task, users) {
        if (task.assignee !== null) {
            [task.assignee] = users.filter((user) => user.username === task.assignee);
        }

        for (const segment of task.segments) {
            for (const job of segment.jobs) {
                if (job.assignee !== null) {
                    [job.assignee] = users.filter((user) => user.username === job.assignee);
                }
            }
        }

        if (task.owner !== null) {
            [task.owner] = users.filter((user) => user.username === task.owner);
        }

        return task;
    }

    function implementAPI(cvat) {
        cvat.plugins.list.implementation = PluginRegistry.list;
        cvat.plugins.register.implementation = PluginRegistry.register.bind(cvat);

        cvat.lambda.list.implementation = lambdaManager.list.bind(lambdaManager);
        cvat.lambda.run.implementation = lambdaManager.run.bind(lambdaManager);
        cvat.lambda.call.implementation = lambdaManager.call.bind(lambdaManager);
        cvat.lambda.cancel.implementation = lambdaManager.cancel.bind(lambdaManager);
        cvat.lambda.listen.implementation = lambdaManager.listen.bind(lambdaManager);
        cvat.lambda.requests.implementation = lambdaManager.requests.bind(lambdaManager);

        cvat.server.about.implementation = async () => {
            const result = await serverProxy.server.about();
            return result;
        };

        cvat.server.share.implementation = async (directory) => {
            const result = await serverProxy.server.share(directory);
            return result;
        };

        cvat.server.formats.implementation = async () => {
            const result = await serverProxy.server.formats();
            return new AnnotationFormats(result);
        };

        cvat.server.userAgreements.implementation = async () => {
            const result = await serverProxy.server.userAgreements();
            return result;
        };

        cvat.server.register.implementation = async (
            username,
            firstName,
            lastName,
            email,
            password1,
            password2,
            userConfirmations,
        ) => {
            const user = await serverProxy.server.register(
                username,
                firstName,
                lastName,
                email,
                password1,
                password2,
                userConfirmations,
            );

            return new User(user);
        };

        cvat.server.login.implementation = async (username, password) => {
            await serverProxy.server.login(username, password);
        };

        cvat.server.loginWithToken.implementation = async (token) => {
            await serverProxy.server.loginWithToken(token);
        };

        cvat.server.logout.implementation = async () => {
            await serverProxy.server.logout();
        };

        cvat.server.changePassword.implementation = async (oldPassword, newPassword1, newPassword2) => {
            await serverProxy.server.changePassword(oldPassword, newPassword1, newPassword2);
        };

        cvat.server.requestPasswordReset.implementation = async (email) => {
            await serverProxy.server.requestPasswordReset(email);
        };

        cvat.server.resetPassword.implementation = async (newPassword1, newPassword2, uid, token) => {
            await serverProxy.server.resetPassword(newPassword1, newPassword2, uid, token);
        };

        cvat.server.authorized.implementation = async () => {
            const result = await serverProxy.server.authorized();
            return result;
        };

        cvat.server.request.implementation = async (url, data) => {
            const result = await serverProxy.server.request(url, data);
            return result;
        };

        cvat.users.get.implementation = async (filter) => {
            checkFilter(filter, {
                self: isBoolean,
            });

            let users = null;
            if ('self' in filter && filter.self) {
                users = await serverProxy.users.getSelf();
                users = [users];
                users = users.map((user) => {
                    let transUser = {
                        id: user.id,
                        username: user.username || user.userName,
                        email: user.email,
                        first_name: null,
                        last_name: null,
                        groups: groupTrans.groupTrans(user.permissionList),
                        last_login: null,
                        date_joined: null,
                        is_staff: true,
                        is_superuser: true,
                        is_active: true,
                        email_verification_required: null,
                    }
                    return new User(transUser);
                });
            } else {
                users = await serverProxy.users.getUsers();
                users = users.map((user) => new User(user));
            }

            // users = users.map((user) => new User(user));

            return users;
        };

        cvat.jobs.get.implementation = async (filter) => {
            checkFilter(filter, {
                taskID: isInteger,
                jobID: isInteger,
            });

            if (('taskID' in filter) && ('jobID' in filter)) {
                throw new ArgumentError(i18next.t('Only one of fields "taskID" and "jobID" allowed simultaneously'));
            }

            if (!Object.keys(filter).length) {
                throw new ArgumentError(i18next.t('Job filter must not be empty'));
            }

            let tasks = null;
            if ('taskID' in filter) {
                tasks = await serverProxy.tasks.getTasks(`id=${filter.taskID}`);
            } else {
                const job = await serverProxy.jobs.getJob(filter.jobID);
                if (typeof job.task_id !== 'undefined') {
                    tasks = await serverProxy.tasks.getTasks(`id=${job.task_id}`);
                }
            }

            // If task was found by its id, then create task instance and get Job instance from it
            if (tasks !== null && tasks.length) {
                const users = (await serverProxy.users.getUsers()).map((userData) => new User(userData));
                const task = new Task(attachUsers(tasks[0], users));

                return filter.jobID ? task.jobs.filter((job) => job.id === filter.jobID) : task.jobs;
            }

            return [];
        };

        cvat.tasks.get.implementation = async (filter) => {
            checkFilter(filter, {
                page: isInteger,
                name: isString,
                id: isInteger,
                owner: isString,
                assignee: isString,
                search: isString,
                status: isEnum.bind(TaskStatus),
                mode: isEnum.bind(TaskMode),
            });

            if ('search' in filter && Object.keys(filter).length > 1) {
                if (!('page' in filter && Object.keys(filter).length === 2)) {
                    throw new ArgumentError(i18next.t('Do not use the filter field "search" with others'));
                }
            }

            if ('id' in filter && Object.keys(filter).length > 1) {
                if (!('page' in filter && Object.keys(filter).length === 2)) {
                    throw new ArgumentError(i18next.t('Do not use the filter field "id" with others'));
                }
            }

            const searchParams = new URLSearchParams();
            for (const field of ['name', 'owner', 'assignee', 'search', 'status', 'mode', 'id', 'page']) {
                if (Object.prototype.hasOwnProperty.call(filter, field)) {
                    searchParams.set(field, filter[field]);
                }
            }

            const users = (await serverProxy.users.getUsers()).map((userData) => new User(userData));
            const tasksData = await serverProxy.tasks.getTasks(searchParams.toString());
            const tasks = tasksData.map((task) => attachUsers(task, users)).map((task) => new Task(task));

            tasks.count = tasksData.count;

            return tasks;
        };

        cvat.server.installedApps.implementation = async () => {
            const result = await serverProxy.server.installedApps();
            return result;
        };

        cvat.tasks.getDatasets.implementation = async (filter) => {
            const result = await serverProxy.tasks.getDatasets(filter);
            return result;
        };

        return cvat;
    }

    module.exports = implementAPI;
})();
