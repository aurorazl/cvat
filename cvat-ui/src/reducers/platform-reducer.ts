// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { BoundariesActionTypes, BoundariesActions } from 'actions/boundaries-actions';
import { PlatformActionTypes, PlatformActions } from 'actions/platform-actions';
import { AuthActionTypes, AuthActions } from 'actions/auth-actions';
import { PlatformState, DatasetInfo, ShareItem } from './interfaces';

const defaultState: PlatformState = {
    datasets: [],
};

export default function (
    state: PlatformState = defaultState,
    action: PlatformActions | AuthActions | BoundariesActions,
): PlatformState {
    switch (action.type) {
        case PlatformActionTypes.LOAD_PLATFORM_DATA_SUCCESS: {
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
