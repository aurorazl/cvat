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
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts';

interface Props {
    canvasInstance: Canvas;
    activeControl: ActiveControl;
    switchSplitShortcut: string;
    splitTrack(enabled: boolean): void;
    lang: string;
}

function SplitControl(props: Props): JSX.Element {
    const { t } = useTranslation();
    const core = getCore();
    const baseURL = core.config.backendAPI.slice(0, -7);

    const { switchSplitShortcut, activeControl, canvasInstance, splitTrack, lang } = props;

    const dynamicIconProps =
        activeControl === ActiveControl.SPLIT
            ? {
                  className: 'cvat-split-track-control cvat-active-canvas-control',
                  onClick: (): void => {
                      canvasInstance.split({ enabled: false });
                      splitTrack(false);
                  },
              }
            : {
                  className: 'cvat-split-track-control',
                  onClick: (): void => {
                      canvasInstance.cancel();
                      canvasInstance.split({ enabled: true });
                      splitTrack(true);
                  },
              };

    return (
        <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].TRACK_MODE_ADVANCED_URL}`} target="blank">{t('Split a track ${switchSplitShortcut}', {switchSplitShortcut: `${switchSplitShortcut}`})}</a>} placement='right' mouseLeaveDelay={0.2}>
            <Icon {...dynamicIconProps} component={SplitIcon} />
        </Tooltip>
    );
}

export default React.memo(SplitControl);
