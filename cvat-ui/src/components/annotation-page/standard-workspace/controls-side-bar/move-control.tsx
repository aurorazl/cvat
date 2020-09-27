// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from 'antd/lib/icon';
import Tooltip from 'antd/lib/tooltip';

import { MoveIcon } from 'icons';
import { ActiveControl } from 'reducers/interfaces';
import { Canvas } from 'cvat-canvas-wrapper';

import { useTranslation } from 'react-i18next';

interface Props {
    canvasInstance: Canvas;
    activeControl: ActiveControl;
}

function MoveControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const { canvasInstance, activeControl } = props;

    return (
        <Tooltip title={t('Move the image')} placement='right' mouseLeaveDelay={0}>
            <Icon
                component={MoveIcon}
                className={activeControl === ActiveControl.DRAG_CANVAS
                    ? 'cvat-move-control cvat-active-canvas-control' : 'cvat-move-control'}
                onClick={(): void => {
                    if (activeControl === ActiveControl.DRAG_CANVAS) {
                        canvasInstance.dragCanvas(false);
                    } else {
                        canvasInstance.cancel();
                        canvasInstance.dragCanvas(true);
                    }
                }}
            />
        </Tooltip>
    );
}

export default React.memo(MoveControl);
