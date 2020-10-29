// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'antd/lib/icon';

import { MergeIcon } from 'icons';
import { Canvas } from 'cvat-canvas-wrapper';
import { ActiveControl } from 'reducers/interfaces';

import { useTranslation } from 'react-i18next';

interface Props {
    canvasInstance: Canvas;
    activeControl: ActiveControl;
    switchMergeShortcut: string;
    mergeObjects(enabled: boolean): void;
}

function MergeControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const { switchMergeShortcut, activeControl, canvasInstance, mergeObjects } = props;

    const dynamicIconProps =
        activeControl === ActiveControl.MERGE
            ? {
                  className: 'cvat-merge-control cvat-active-canvas-control',
                  onClick: (): void => {
                      canvasInstance.merge({ enabled: false });
                      mergeObjects(false);
                  },
              }
            : {
                  className: 'cvat-merge-control',
                  onClick: (): void => {
                      canvasInstance.cancel();
                      canvasInstance.merge({ enabled: true });
                      mergeObjects(true);
                  },
              };

    return (
        <Tooltip title={t('Merge shapes/tracks ${switchMergeShortcut}').replace('${switchMergeShortcut}', `${switchMergeShortcut}`)} placement='right' mouseLeaveDelay={0}>
            <Icon {...dynamicIconProps} component={MergeIcon} />
        </Tooltip>
    );
}

export default React.memo(MergeControl);
