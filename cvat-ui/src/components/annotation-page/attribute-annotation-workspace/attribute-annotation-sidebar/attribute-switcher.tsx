// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from 'antd/lib/icon';
import Text from 'antd/lib/typography/Text';
import Tooltip from 'antd/lib/tooltip';
import Button from 'antd/lib/button';

import { useTranslation } from 'react-i18next';

interface Props {
    currentAttribute: string;
    currentIndex: number;
    attributesCount: number;
    normalizedKeyMap: Record<string, string>;
    nextAttribute(step: number): void;
}

function AttributeSwitcher(props: Props): JSX.Element {
    const { t } = useTranslation();
    const { currentAttribute, currentIndex, attributesCount, nextAttribute, normalizedKeyMap } = props;

    const title = `${currentAttribute} [${currentIndex + 1}/${attributesCount}]`;
    return (
        <div className='attribute-annotation-sidebar-attribute-switcher'>
            <Tooltip title={t('Previous attribute ${normalizedKeyMap.PREVIOUS_ATTRIBUTE}').replace('${normalizedKeyMap.PREVIOUS_ATTRIBUTE}', `${normalizedKeyMap.PREVIOUS_ATTRIBUTE}`)} mouseLeaveDelay={0}>
                <Button disabled={attributesCount <= 1} onClick={() => nextAttribute(-1)}>
                    <Icon type='left' />
                </Button>
            </Tooltip>
            <Tooltip title={title} mouseLeaveDelay={0}>
                <Text className='cvat-text'>{currentAttribute}</Text>
                <Text strong>{` [${currentIndex + 1}/${attributesCount}]`}</Text>
            </Tooltip>
            <Tooltip title={t('Next attribute ${normalizedKeyMap.NEXT_ATTRIBUTE}').replace('${normalizedKeyMap.NEXT_ATTRIBUTE}', `${normalizedKeyMap.NEXT_ATTRIBUTE}`)} mouseLeaveDelay={0}>
                <Button disabled={attributesCount <= 1} onClick={() => nextAttribute(1)}>
                    <Icon type='right' />
                </Button>
            </Tooltip>
        </div>
    );
}

export default React.memo(AttributeSwitcher);
