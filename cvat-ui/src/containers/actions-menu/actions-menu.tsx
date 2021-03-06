// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { connect } from 'react-redux';

import ActionsMenuComponent, { Actions } from 'components/actions-menu/actions-menu';
import { CombinedState } from 'reducers/interfaces';

import { modelsActions } from 'actions/models-actions';
import { dumpAnnotationsAsync, loadAnnotationsAsync, exportDatasetAsync, deleteTaskAsync, exportToPlatformAsync } from 'actions/tasks-actions';
import { ClickParam } from 'antd/lib/menu';

interface OwnProps {
    taskInstance: any;
}

interface StateToProps {
    annotationFormats: any;
    loadActivity: string | null;
    dumpActivities: string[] | null;
    exportActivities: string[] | null;
    inferenceIsActive: boolean;
    pushActivity: any;
    lang: string;
}

interface DispatchToProps {
    loadAnnotations: (taskInstance: any, loader: any, file: File) => void;
    dumpAnnotations: (taskInstance: any, dumper: any) => void;
    exportDataset: (taskInstance: any, exporter: any) => void;
    deleteTask: (taskInstance: any) => void;
    openRunModelWindow: (taskInstance: any) => void;
    exportToPlatform: (taskInstance: any) => void;
}

function mapStateToProps(state: CombinedState, own: OwnProps): StateToProps {
    const {
        taskInstance: { id: tid },
    } = own;

    const {
        formats: { annotationFormats },
        tasks: {
            activities: { dumps, loads, exports: activeExports, pushes },
        },
        lang: { lang },
    } = state;

    return {
        dumpActivities: tid in dumps ? dumps[tid] : null,
        exportActivities: tid in activeExports ? activeExports[tid] : null,
        loadActivity: tid in loads ? loads[tid] : null,
        annotationFormats,
        inferenceIsActive: tid in state.models.inferences,
        pushActivity: tid === pushes['taskId'] ? pushes : null,
        lang,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        loadAnnotations: (taskInstance: any, loader: any, file: File): void => {
            dispatch(loadAnnotationsAsync(taskInstance, loader, file));
        },
        dumpAnnotations: (taskInstance: any, dumper: any): void => {
            dispatch(dumpAnnotationsAsync(taskInstance, dumper));
        },
        exportDataset: (taskInstance: any, exporter: any): void => {
            dispatch(exportDatasetAsync(taskInstance, exporter));
        },
        deleteTask: (taskInstance: any): void => {
            dispatch(deleteTaskAsync(taskInstance));
        },
        openRunModelWindow: (taskInstance: any): void => {
            dispatch(modelsActions.showRunModelDialog(taskInstance));
        },
        exportToPlatform: (taskInstance: any): void => {
            dispatch(exportToPlatformAsync(taskInstance));
        },
    };
}

function ActionsMenuContainer(props: OwnProps & StateToProps & DispatchToProps): JSX.Element {
    const {
        taskInstance,
        annotationFormats: { loaders, dumpers },
        loadActivity,
        dumpActivities,
        exportActivities,
        inferenceIsActive,
        pushActivity,

        loadAnnotations,
        dumpAnnotations,
        exportDataset,
        deleteTask,
        openRunModelWindow,
        exportToPlatform,
        lang,
    } = props;

    function onClickMenu(params: ClickParam, file?: File): void {
        if (params.keyPath.length > 1) {
            const [additionalKey, action] = params.keyPath;
            if (action === Actions.DUMP_TASK_ANNO) {
                const format = additionalKey;
                const [dumper] = dumpers.filter((_dumper: any): boolean => _dumper.name === format);
                if (dumper) {
                    dumpAnnotations(taskInstance, dumper);
                }
            } else if (action === Actions.LOAD_TASK_ANNO) {
                const format = additionalKey;
                const [loader] = loaders.filter((_loader: any): boolean => _loader.name === format);
                if (loader && file) {
                    loadAnnotations(taskInstance, loader, file);
                }
            } else if (action === Actions.EXPORT_TASK_DATASET) {
                const format = additionalKey;
                const [exporter] = dumpers.filter((_exporter: any): boolean => _exporter.name === format);
                if (exporter) {
                    exportDataset(taskInstance, exporter);
                }
            }
        } else {
            const [action] = params.keyPath;
            if (action === Actions.DELETE_TASK) {
                deleteTask(taskInstance);
            } else if (action === Actions.OPEN_BUG_TRACKER) {
                // eslint-disable-next-line
                window.open(`${taskInstance.bugTracker}`, '_blank');
            } else if (action === Actions.RUN_AUTO_ANNOTATION) {
                openRunModelWindow(taskInstance);
            } else if (action === Actions.EXPORT_TO_PLATFORM) {
                exportToPlatform(taskInstance);
            }
        }
    }

    return (
        <ActionsMenuComponent
            taskID={taskInstance.id}
            taskMode={taskInstance.mode}
            bugTracker={taskInstance.bugTracker}
            loaders={loaders}
            dumpers={dumpers}
            loadActivity={loadActivity}
            dumpActivities={dumpActivities}
            exportActivities={exportActivities}
            inferenceIsActive={inferenceIsActive}
            pushActivity={pushActivity}
            onClickMenu={onClickMenu}
            lang={lang}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsMenuContainer);
