// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import getCore from 'cvat-core-wrapper';

import { HwDatasetInfo } from 'reducers/interfaces';

const core = getCore();

export enum DatasetActionTypes {
    GET_DS_DATA = 'GET_DS_DATA',
    GET_DATASET_DATA_SUCCESS = 'GET_DATASET_DATA_SUCCESS',
    GET_DS_DATA_FAILED = 'GET_DS_DATA_FAILED',
}

const datasetActions = {
    getDatasetData: () => createAction(DatasetActionTypes.GET_DS_DATA),
    getDatasetDataSuccess: (values: HwDatasetInfo) =>
        createAction(DatasetActionTypes.GET_DATASET_DATA_SUCCESS, {
            values,
        }),
    getDatasetDataFailed: (error: any) => createAction(DatasetActionTypes.GET_DS_DATA_FAILED, { error }),
};

export type DatasetActions = ActionUnion<typeof datasetActions>;

export function getDatasetDataAsync(dsId: number | undefined, success: () => void, failure: () => void): ThunkAction {
    return async (dispatch): Promise<void> => {
        try {
            dispatch(datasetActions.getDatasetData());
            const {id, name, cvDatasetFormat, annotType, itemCount, tag } = await core.tasks.getDataset(dsId);
            const dataset = {id, name, cvDatasetFormat, annotType, itemCount, tag };
            success();
            dispatch(datasetActions.getDatasetDataSuccess(dataset as HwDatasetInfo));
        } catch (error) {
            failure();
            dispatch(datasetActions.getDatasetDataFailed(error));
        }
    };
}
