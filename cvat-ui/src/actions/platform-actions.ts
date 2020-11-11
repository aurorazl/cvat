// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import getCore from 'cvat-core-wrapper';

import { DatasetInfo } from 'reducers/interfaces';

const core = getCore();

export enum PlatformActionTypes {
    LOAD_PLATFORM_DATA = 'LOAD_PLATFORM_DATA',
    LOAD_PLATFORM_DATA_SUCCESS = 'LOAD_PLATFORM_DATA_SUCCESS',
    LOAD_PLATFORM_DATA_FAILED = 'LOAD_PLATFORM_DATA_FAILED',
}

const platformActions = {
    loadPlatformData: () => createAction(PlatformActionTypes.LOAD_PLATFORM_DATA),
    loadPlatformDataSuccess: (values: DatasetInfo[]) =>
        createAction(PlatformActionTypes.LOAD_PLATFORM_DATA_SUCCESS, {
            values,
        }),
    loadPlatformDataFailed: (error: any) => createAction(PlatformActionTypes.LOAD_PLATFORM_DATA_FAILED, { error }),
};

export type PlatformActions = ActionUnion<typeof platformActions>;

export function loadPlatformDataAsync(success: () => void, failure: () => void): ThunkAction {
    return async (dispatch): Promise<void> => {
        try {
            dispatch(platformActions.loadPlatformData());
            const values = await core.tasks.getDatasets();
            const datasets = values.map((d: any)=>({id: d.id, name: d.name, path: d.path}));
            success();
            dispatch(platformActions.loadPlatformDataSuccess(datasets as DatasetInfo[]));
        } catch (error) {
            failure();
            dispatch(platformActions.loadPlatformDataFailed(error));
        }
    };
}
