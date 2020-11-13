// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Menu, { ClickParam } from 'antd/lib/menu';
import Tooltip from 'antd/lib/tooltip';
import Modal from 'antd/lib/modal';
import notification from 'antd/lib/notification';

import DumpSubmenu from './dump-submenu';
import LoadSubmenu from './load-submenu';
import ExportSubmenu from './export-submenu';
import PushSubmenu from './push-submenu';

import { useTranslation } from 'react-i18next';
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts';

interface Props {
    taskID: number;
    taskMode: string;
    bugTracker: string;
    loaders: any[];
    dumpers: any[];
    loadActivity: string | null;
    dumpActivities: string[] | null;
    exportActivities: string[] | null;
    inferenceIsActive: boolean;
    pushActivity: any;

    onClickMenu: (params: ClickParam, file?: File) => void;
}

export enum Actions {
    DUMP_TASK_ANNO = 'dump_task_anno',
    LOAD_TASK_ANNO = 'load_task_anno',
    EXPORT_TASK_DATASET = 'export_task_dataset',
    DELETE_TASK = 'delete_task',
    RUN_AUTO_ANNOTATION = 'run_auto_annotation',
    OPEN_BUG_TRACKER = 'open_bug_tracker',
    EXPORT_TO_PLATFORM = 'export_to_platform',
}

export default function ActionsMenuComponent(props: Props): JSX.Element {
    const { t } = useTranslation();
    const core = getCore();
    const baseURL = core.config.backendAPI.slice(0, -7);

    const {
        taskID,
        taskMode,
        bugTracker,
        inferenceIsActive,
        pushActivity,
        dumpers,
        loaders,
        onClickMenu,
        dumpActivities,
        exportActivities,
        loadActivity,
    } = props;

    let latestParams: ClickParam | null = null;
    function onClickMenuWrapper(params: ClickParam | null, file?: File): void {
        const copyParams = params || latestParams;
        if (!copyParams) {
            return;
        }
        latestParams = copyParams;

        if (copyParams.keyPath.length === 2) {
            const [, action] = copyParams.keyPath;
            if (action === Actions.LOAD_TASK_ANNO) {
                if (file) {
                    Modal.confirm({
                        title: t('Current annotation will be lost'),
                        content: t('You are going to upload new annotations to this task. Continue?'),
                        onOk: () => {
                            onClickMenu(copyParams, file);
                        },
                        okButtonProps: {
                            type: 'danger',
                        },
                        okText: t('Update'),
                    });
                }
            } else {
                onClickMenu(copyParams);
            }
        } else if (copyParams.key === Actions.DELETE_TASK) {
            Modal.confirm({
                title: t('The task ${taskID} will be deleted').replace('${taskID}', `${taskID}`),
                content: t('All related data (images, annotations) will be lost. Continue?'),
                onOk: () => {
                    onClickMenu(copyParams);
                },
                okButtonProps: {
                    type: 'danger',
                },
                okText: t('Delete'),
            });
        } else {
            onClickMenu(copyParams);
        }
    }

    return (
        <>
        <Menu selectable={false} className='cvat-actions-menu' onClick={onClickMenuWrapper}>
            {DumpSubmenu({
                taskMode,
                dumpers,
                dumpActivities,
                menuKey: Actions.DUMP_TASK_ANNO,
            })}
            {LoadSubmenu({
                loaders,
                loadActivity,
                onFileUpload: (file: File): void => {
                    onClickMenuWrapper(null, file);
                },
                menuKey: Actions.LOAD_TASK_ANNO,
            })}
            {ExportSubmenu({
                exporters: dumpers,
                exportActivities,
                menuKey: Actions.EXPORT_TASK_DATASET,
            })}
            {/* {PushSubmenu({
                taskMode,
                dumpers,
                dumpActivities,
                menuKey: Actions.EXPORT_TO_PLATFORM,
            })} */}
            {!!bugTracker && <Menu.Item key={Actions.OPEN_BUG_TRACKER}>{t('Open bug tracker')}</Menu.Item>}
            <Menu.Item disabled={inferenceIsActive} key={Actions.RUN_AUTO_ANNOTATION}>
                <Tooltip title={<a href={`${baseURL}/${linkConsts.AUTOMATIC_ANNOTATION_URL}`} target="blank">查看帮助</a>} placement='left' mouseLeaveDelay={0.2}>
                    {t('Automatic annotation')}
                </Tooltip>
            </Menu.Item>
            <Menu.Item key={Actions.EXPORT_TO_PLATFORM}>{t('Push to AI platform')}</Menu.Item>
            <hr />
            <Menu.Item key={Actions.DELETE_TASK}>{t('Delete')}</Menu.Item>
        </Menu>
            {pushActivity && pushActivity['status'] === 'PUSHED' ? (
                notification.success({
                    message: t('Push succeeded!'),
                })
            ) : null}
            {pushActivity && pushActivity['status'] === 'FAILED' ? (
                notification.error({
                    message: t('Push failed!'),
                })
            ) : null}
        </>
    );
}
