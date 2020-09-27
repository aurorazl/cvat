// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'antd/lib/icon';

import { SplitIcon } from 'icons';
import { Canvas } from 'cvat-canvas-wrapper';
import { ActiveControl } from 'reducers/interfaces';

import { useTranslation } from 'react-i18next';

interface Props {
    canvasInstance: Canvas;
    activeControl: ActiveControl;
    switchSplitShortcut: string;
    splitTrack(enabled: boolean): void;
}

function SplitControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        switchSplitShortcut,
        activeControl,
        canvasInstance,
        splitTrack,
    } = props;

    const dynamicIconProps = activeControl === ActiveControl.SPLIT
        ? {
            className: 'cvat-split-track-control cvat-active-canvas-control',
            onClick: (): void => {
                canvasInstance.split({ enabled: false });
                splitTrack(false);
            },
        } : {
            className: 'cvat-split-track-control',
            onClick: (): void => {
                canvasInstance.cancel();
                canvasInstance.split({ enabled: true });
                splitTrack(true);
            },
        };

    return (
        <Tooltip title={t('Split a track ${switchSplitShortcut}').replace('${switchSplitShortcut}', `${switchSplitShortcut}`)} placement='right' mouseLeaveDelay={0}>
            <Icon {...dynamicIconProps} component={SplitIcon} />
        </Tooltip>
    );
}

export default React.memo(SplitControl);
