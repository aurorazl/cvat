// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';

import Modal from 'antd/lib/modal';
import InputNumber from 'antd/lib/input-number';
import Text from 'antd/lib/typography/Text';
import { clamp } from 'utils/math';
import { useTranslation } from 'react-i18next';

interface Props {
    visible: boolean;
    propagateFrames: number;
    propagateUpToFrame: number;
    stopFrame: number;
    frameNumber: number;
    propagateObject(): void;
    cancel(): void;
    changePropagateFrames(value: number): void;
    changeUpToFrame(value: number): void;
}

export default function PropagateConfirmComponent(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        visible,
        propagateFrames,
        propagateUpToFrame,
        stopFrame,
        frameNumber,
        propagateObject,
        changePropagateFrames,
        changeUpToFrame,
        cancel,
    } = props;

    const minPropagateFrames = 1;

    return (
        <Modal
            okType='primary'
            okText={t('Yes')}
            cancelText={t('Cancel')}
            onOk={propagateObject}
            onCancel={cancel}
            title={t('Confirm propagation')}
            visible={visible}
        >
            <div className='cvat-propagate-confirm'>
                <Text>{t('Do you want to make a copy of the object on')}</Text>
                <InputNumber
                    size='small'
                    min={minPropagateFrames}
                    value={propagateFrames}
                    onChange={(value: number | undefined) => {
                        if (typeof (value) === 'number') {
                            changePropagateFrames(Math.floor(
                                clamp(value, minPropagateFrames, Number.MAX_SAFE_INTEGER),
                            ));
                        }
                    }}
                />
                {
                    propagateFrames > 1
                        ? <Text> {t('frames')} </Text>
                        : <Text> {t('frame')} </Text>
                }
                <Text>{t('up to the')} </Text>
                <InputNumber
                    size='small'
                    value={propagateUpToFrame}
                    min={frameNumber + 1}
                    max={stopFrame}
                    onChange={(value: number | undefined) => {
                        if (typeof (value) === 'number') {
                            changeUpToFrame(Math.floor(
                                clamp(value, frameNumber + 1, stopFrame),
                            ));
                        }
                    }}
                />
                <Text>{t('frame')}</Text>
            </div>
        </Modal>
    );
}
