// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';

import { Task, TasksQuery, CombinedState } from 'reducers/interfaces';

import TasksPageComponent from 'components/tasks-page/tasks-page';

import { getTasksAsync, hideEmptyTasks } from 'actions/tasks-actions';

interface StateToProps {
    tasksFetching: boolean;
    gettingQuery: TasksQuery;
    numberOfTasks: number;
    numberOfVisibleTasks: number;
    numberOfHiddenTasks: number;
    lang: string;
}

interface DispatchToProps {
    onGetTasks: (gettingQuery: TasksQuery) => void;
    hideEmptyTasks: (hideEmpty: boolean) => void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const { tasks } = state;
    const { lang } = state.lang;

    return {
        tasksFetching: state.tasks.fetching,
        gettingQuery: tasks.gettingQuery,
        numberOfTasks: state.tasks.count,
        numberOfVisibleTasks: state.tasks.current.length,
        numberOfHiddenTasks: tasks.hideEmpty
            ? tasks.current.filter((task: Task): boolean => !task.instance.jobs.length).length
            : 0,
        lang,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        onGetTasks: (query: TasksQuery): void => {
            dispatch(getTasksAsync(query));
        },
        hideEmptyTasks: (hideEmpty: boolean): void => {
            dispatch(hideEmptyTasks(hideEmpty));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksPageComponent);
