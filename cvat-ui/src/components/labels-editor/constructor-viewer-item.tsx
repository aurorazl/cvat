// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from 'antd/lib/icon';
import Tooltip from 'antd/lib/tooltip';
import Text from 'antd/lib/typography/Text';

import consts from 'consts';
import { Label } from './common';

import { useTranslation } from 'react-i18next';

interface ConstructorViewerItemProps {
    label: Label;
    color: string;
    onUpdate: (label: Label) => void;
    onDelete: (label: Label) => void;
}

export default function ConstructorViewerItem(props: ConstructorViewerItemProps): JSX.Element {
    const { t } = useTranslation();
    const {
        color,
        label,
        onUpdate,
        onDelete,
    } = props;

    return (
        <div style={{ background: color || consts.NEW_LABEL_COLOR }} className='cvat-constructor-viewer-item'>
            <Text>{label.name}</Text>
            <Tooltip title={t('Update attributes')} mouseLeaveDelay={0}>
                <span
                    role='button'
                    tabIndex={0}
                    onClick={(): void => onUpdate(label)}
                    onKeyPress={(): boolean => false}
                >
                    <Icon theme='filled' type='edit' />
                </span>
            </Tooltip>
            { label.id < 0
                && (
                    <Tooltip title={t('Delete label')} mouseLeaveDelay={0}>
                        <span
                            role='button'
                            tabIndex={0}
                            onClick={(): void => onDelete(label)}
                            onKeyPress={(): boolean => false}
                        >
                            <Icon type='close' />
                        </span>
                    </Tooltip>
                )}
        </div>
    );
}
