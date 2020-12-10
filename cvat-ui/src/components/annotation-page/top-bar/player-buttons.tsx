// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';

import { Col } from 'antd/lib/grid';
import Icon from 'antd/lib/icon';
import Tooltip from 'antd/lib/tooltip';
import Popover from 'antd/lib/popover';

import {
    FirstIcon,
    BackJumpIcon,
    PreviousIcon,
    PreviousFilteredIcon,
    PreviousEmptyIcon,
    PlayIcon,
    PauseIcon,
    NextIcon,
    NextFilteredIcon,
    NextEmptyIcon,
    ForwardJumpIcon,
    LastIcon,
} from 'icons';

import { useTranslation } from 'react-i18next';
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts';

interface Props {
    playing: boolean;
    playPauseShortcut: string;
    nextFrameShortcut: string;
    previousFrameShortcut: string;
    forwardShortcut: string;
    backwardShortcut: string;
    prevButtonType: string;
    nextButtonType: string;
    onSwitchPlay(): void;
    onPrevFrame(): void;
    onNextFrame(): void;
    onForward(): void;
    onBackward(): void;
    onFirstFrame(): void;
    onLastFrame(): void;
    setPrevButton(type: 'regular' | 'filtered' | 'empty'): void;
    setNextButton(type: 'regular' | 'filtered' | 'empty'): void;
    lang: string;
}

function PlayerButtons(props: Props): JSX.Element {
    const { t } = useTranslation();
    const core = getCore();
    const baseURL = core.config.backendAPI.slice(0, -7);

    const {
        playing,
        playPauseShortcut,
        nextFrameShortcut,
        previousFrameShortcut,
        forwardShortcut,
        backwardShortcut,
        prevButtonType,
        nextButtonType,
        onSwitchPlay,
        onPrevFrame,
        onNextFrame,
        onForward,
        onBackward,
        onFirstFrame,
        onLastFrame,
        setPrevButton,
        setNextButton,
        lang,
    } = props;

    const prevRegularText = t('Go back');
    const prevFilteredText = t('Go back with a filter');
    const prevEmptyText = t('Go back to an empty frame');
    const nextRegularText = t('Go next');
    const nextFilteredText = t('Go next with a filter');
    const nextEmptyText = t('Go next to an empty frame');

    let prevButton = <Icon className='cvat-player-previous-button' component={PreviousIcon} onClick={onPrevFrame} />;
    let prevButtonTooltipMessage = prevRegularText;
    if (prevButtonType === 'filtered') {
        prevButton = (
            <Icon className='cvat-player-previous-button' component={PreviousFilteredIcon} onClick={onPrevFrame} />
        );
        prevButtonTooltipMessage = prevFilteredText;
    } else if (prevButtonType === 'empty') {
        prevButton = (
            <Icon className='cvat-player-previous-button' component={PreviousEmptyIcon} onClick={onPrevFrame} />
        );
        prevButtonTooltipMessage = prevEmptyText;
    }

    let nextButton = <Icon className='cvat-player-next-button' component={NextIcon} onClick={onNextFrame} />;
    let nextButtonTooltipMessage = nextRegularText;
    if (nextButtonType === 'filtered') {
        nextButton = (
            <Icon className='cvat-player-previous-button' component={NextFilteredIcon} onClick={onNextFrame} />
        );
        nextButtonTooltipMessage = nextFilteredText;
    } else if (nextButtonType === 'empty') {
        nextButton = <Icon className='cvat-player-previous-button' component={NextEmptyIcon} onClick={onNextFrame} />;
        nextButtonTooltipMessage = nextEmptyText;
    }

    return (
        <Col className='cvat-player-buttons'>
            <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{t('Go to the first frame')}</a>} mouseLeaveDelay={0.2}>
                <Icon className='cvat-player-first-button' component={FirstIcon} onClick={onFirstFrame} />
            </Tooltip>
            <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{t('Go back with a step ${backwardShortcut}', {backwardShortcut: `${backwardShortcut}`})}</a>} mouseLeaveDelay={0.2}>
                <Icon className='cvat-player-backward-button' component={BackJumpIcon} onClick={onBackward} />
            </Tooltip>
            <Popover
                trigger='contextMenu'
                placement='bottom'
                content={
                    <>
                        <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{`${prevRegularText}`}</a>} mouseLeaveDelay={0.2}>
                            <Icon
                                className='cvat-player-previous-inlined-button'
                                component={PreviousIcon}
                                onClick={() => {
                                    setPrevButton('regular');
                                }}
                            />
                        </Tooltip>
                            <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{`${prevFilteredText}`}</a>} mouseLeaveDelay={0.2}>
                            <Icon
                                className='cvat-player-previous-filtered-inlined-button'
                                component={PreviousFilteredIcon}
                                onClick={() => {
                                    setPrevButton('filtered');
                                }}
                            />
                        </Tooltip>
                            <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{`${prevEmptyText}`}</a>} mouseLeaveDelay={0.2}>
                            <Icon
                                className='cvat-player-previous-empty-inlined-button'
                                component={PreviousEmptyIcon}
                                onClick={() => {
                                    setPrevButton('empty');
                                }}
                            />
                        </Tooltip>
                    </>
                }
            >
                <Tooltip
                    placement='top'
                    mouseLeaveDelay={0.2}
                    title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{`${prevButtonTooltipMessage} ${previousFrameShortcut}`}</a>}
                >
                    {prevButton}
                </Tooltip>
            </Popover>

            {!playing ? (
                    <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{t('Play ${playPauseShortcut}', {playPauseShortcut: `${playPauseShortcut}`})}</a>} mouseLeaveDelay={0.2}>
                        <Icon className='cvat-player-play-button' component={PlayIcon} onClick={onSwitchPlay} />
                    </Tooltip>
                ) : (
                <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{t('Pause ${playPauseShortcut}', {playPauseShortcut: `${playPauseShortcut}`})}</a>} mouseLeaveDelay={0.2}>
                        <Icon className='cvat-player-pause-button' component={PauseIcon} onClick={onSwitchPlay} />
                    </Tooltip>
                )}

            <Popover
                trigger='contextMenu'
                placement='bottom'
                content={
                    <>
                        <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{`${nextRegularText}`}</a>} mouseLeaveDelay={0.2}>
                            <Icon
                                className='cvat-player-next-inlined-button'
                                component={NextIcon}
                                onClick={() => {
                                    setNextButton('regular');
                                }}
                            />
                        </Tooltip>
                            <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{`${nextFilteredText}`}</a>} mouseLeaveDelay={0.2}>
                            <Icon
                                className='cvat-player-next-filtered-inlined-button'
                                component={NextFilteredIcon}
                                onClick={() => {
                                    setNextButton('filtered');
                                }}
                            />
                        </Tooltip>
                            <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{`${nextEmptyText}`}</a>} mouseLeaveDelay={0.2}>
                            <Icon
                                className='cvat-player-next-empty-inlined-button'
                                component={NextEmptyIcon}
                                onClick={() => {
                                    setNextButton('empty');
                                }}
                            />
                        </Tooltip>
                    </>
                }
            >
                <Tooltip placement='top' mouseLeaveDelay={0} title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{`${nextButtonTooltipMessage} ${nextFrameShortcut}`}</a>}>
                    {nextButton}
                </Tooltip>
            </Popover>
            <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{t('Go next with a step ${forwardShortcut}', {forwardShortcut: `${forwardShortcut}`})}</a>} mouseLeaveDelay={0.2}>
                <Icon className='cvat-player-forward-button' component={ForwardJumpIcon} onClick={onForward} />
            </Tooltip>
            <Tooltip title={<a href={`${baseURL}/${linkConsts[lang].PLAYER}`} target="blank">{t('Go to the last frame')}</a>} mouseLeaveDelay={0.2}>
                <Icon className='cvat-player-last-button' component={LastIcon} onClick={onLastFrame} />
            </Tooltip>
        </Col>
    );
}

export default React.memo(PlayerButtons);
