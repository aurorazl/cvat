// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { BoundariesActionTypes, BoundariesActions } from 'actions/boundaries-actions';
import { DatasetActionTypes, DatasetActions } from 'actions/dataset-actions';
import { AuthActionTypes, AuthActions } from 'actions/auth-actions';
import { DatasetState } from './interfaces';

const defaultState: DatasetState = {
    datasets: [],
};

export default function (
    state: DatasetState = defaultState,
    action: DatasetActions | AuthActions | BoundariesActions,
): DatasetState {
    switch (action.type) {
        case DatasetActionTypes.GET_DATASET_DATA_SUCCESS: {
            const { values } = action.payload;

            return {
                datasets: values
            };
        }
        case BoundariesActionTypes.RESET_AFTER_ERROR:
        case AuthActionTypes.LOGOUT_SUCCESS: {
            return { ...defaultState };
        }
        default:
            return state;
    }
}
