// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from 'antd/lib/icon';
import Tooltip from 'antd/lib/tooltip';
import Popover from 'antd/lib/popover';

import { RotateIcon } from 'icons';
import { Rotation } from 'reducers/interfaces';

import { useTranslation } from 'react-i18next';

interface Props {
    clockwiseShortcut: string;
    anticlockwiseShortcut: string;
    rotateFrame(rotation: Rotation): void;
}

function RotateControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const { anticlockwiseShortcut, clockwiseShortcut, rotateFrame } = props;

    return (
        <Popover
            overlayClassName='cvat-rotate-canvas-controls'
            placement='right'
            content={
                <>
                    <Tooltip 
                        title={t('Rotate the image anticlockwise ${anticlockwiseShortcut}').replace('${anticlockwiseShortcut}', `${anticlockwiseShortcut}`)} 
                        placement='topRight' 
                        mouseLeaveDelay={0}
                    >
                        <Icon
                            className='cvat-rotate-canvas-controls-left'
                            onClick={(): void => rotateFrame(Rotation.ANTICLOCKWISE90)}
                            component={RotateIcon}
                        />
                    </Tooltip>
                    <Tooltip 
                        title={t('Rotate the image clockwise ${clockwiseShortcut}').replace('${clockwiseShortcut}', `${clockwiseShortcut}`)} 
                        placement='topRight' 
                        mouseLeaveDelay={0}
                    >
                        <Icon
                            className='cvat-rotate-canvas-controls-right'
                            onClick={(): void => rotateFrame(Rotation.CLOCKWISE90)}
                            component={RotateIcon}
                        />
                    </Tooltip>
                </>
            }
            trigger='hover'
        >
            <Icon className='cvat-rotate-canvas-control' component={RotateIcon} />
        </Popover>
    );
}

export default React.memo(RotateControl);
