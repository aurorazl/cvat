// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'antd/lib/icon';

import { GroupIcon } from 'icons';
import { Canvas } from 'cvat-canvas-wrapper';
import { ActiveControl } from 'reducers/interfaces';

import { useTranslation } from 'react-i18next';

interface Props {
    canvasInstance: Canvas;
    activeControl: ActiveControl;
    switchGroupShortcut: string;
    resetGroupShortcut: string;
    groupObjects(enabled: boolean): void;
}

function GroupControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        switchGroupShortcut,
        resetGroupShortcut,
        activeControl,
        canvasInstance,
        groupObjects,
    } = props;

    const dynamicIconProps = activeControl === ActiveControl.GROUP
        ? {
            className: 'cvat-group-control cvat-active-canvas-control',
            onClick: (): void => {
                canvasInstance.group({ enabled: false });
                groupObjects(false);
            },
        } : {
            className: 'cvat-group-control',
            onClick: (): void => {
                canvasInstance.cancel();
                canvasInstance.group({ enabled: true });
                groupObjects(true);
            },
        };

    const title = t('Group shapes/tracks ${switchGroupShortcut}.').replace('${switchGroupShortcut}', `${switchGroupShortcut}`)
        + t(' Select and press ${resetGroupShortcut} to reset a group').replace('${resetGroupShortcut}', `${resetGroupShortcut}`);
    return (
        <Tooltip title={title} placement='right' mouseLeaveDelay={0}>
            <Icon {...dynamicIconProps} component={GroupIcon} />
        </Tooltip>
    );
}

export default React.memo(GroupControl);
