// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from 'antd/lib/icon';
import Tooltip from 'antd/lib/tooltip';

import { CursorIcon } from 'icons';
import { ActiveControl } from 'reducers/interfaces';
import { Canvas } from 'cvat-canvas-wrapper';

import { useTranslation } from 'react-i18next';

interface Props {
    canvasInstance: Canvas;
    cursorShortkey: string;
    activeControl: ActiveControl;
}

function CursorControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        canvasInstance,
        activeControl,
        cursorShortkey,
    } = props;

    return (
        <Tooltip title={t('Cursor ${cursorShortkey}', {cursorShortkey: `${cursorShortkey}`})} placement='right' mouseLeaveDelay={0}>
            <Icon
                component={CursorIcon}
                className={activeControl === ActiveControl.CURSOR
                    ? 'cvat-active-canvas-control' : ''}
                onClick={
                    activeControl !== ActiveControl.CURSOR
                        ? (): void => canvasInstance.cancel()
                        : undefined
                }
            />
        </Tooltip>
    );
}

export default React.memo(CursorControl);
