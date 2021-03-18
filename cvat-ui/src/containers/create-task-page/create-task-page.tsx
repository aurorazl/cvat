// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { CombinedState } from 'reducers/interfaces';
import CreateTaskComponent from 'components/create-task-page/create-task-page';
import { CreateTaskData } from 'components/create-task-page/create-task-content';
import { createTaskAsync } from 'actions/tasks-actions';

type Props = RouteComponentProps<{dsId: string | undefined}>;
interface StateToProps {
    taskId: number | null;
    status: string;
    error: string;
    installedGit: boolean;
    lang: string;
    dsId: number | undefined;
}

interface DispatchToProps {
    onCreate: (data: CreateTaskData) => void;
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        onCreate: (data: CreateTaskData): void => dispatch(createTaskAsync(data)),
    };
}

function mapStateToProps(state: CombinedState, own: Props): StateToProps {
    const { creates } = state.tasks.activities;
    const { lang } = state.lang;
    const { dsId } = own.match.params;

    return {
        ...creates,
        installedGit: state.plugins.list.GIT_INTEGRATION,
        lang,
        dsId: !!dsId ? Number.parseInt(dsId) : undefined,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskComponent);
