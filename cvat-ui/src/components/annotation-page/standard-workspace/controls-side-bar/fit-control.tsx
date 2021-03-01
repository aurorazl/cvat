// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from 'antd/lib/icon';
import Tooltip from 'antd/lib/tooltip';

import { FitIcon } from 'icons';
import { Canvas } from 'cvat-canvas-wrapper';

import { useTranslation } from 'react-i18next';

interface Props {
    canvasInstance: Canvas;
}

function FitControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const { canvasInstance } = props;

    return (
        <Tooltip title={t('Fit the image [Double Click]')} placement='right' mouseLeaveDelay={0}>
            <Icon className='cvat-fit-control' component={FitIcon} onClick={(): void => canvasInstance.fit()}/>
        </Tooltip>
    );
}

export default React.memo(FitControl);
