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
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts';

interface Props {
    canvasInstance: Canvas;
    activeControl: ActiveControl;
    switchMergeShortcut: string;
    mergeObjects(enabled: boolean): void;
    lang: string;
}

function MergeControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const core = getCore();
    const baseURL = core.config.backendAPI.slice(0, -7);

    const { switchMergeShortcut, activeControl, canvasInstance, mergeObjects, lang } = props;

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
        <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].TRACK_MODE_BASICS_URL}`} target="blank">{t('Merge shapes/tracks ${switchMergeShortcut}', {switchMergeShortcut: `${switchMergeShortcut}`})}</a>} placement='right' mouseLeaveDelay={0.2}>
            <Icon {...dynamicIconProps} component={MergeIcon} />
        </Tooltip>
    );
}

export default React.memo(MergeControl);
