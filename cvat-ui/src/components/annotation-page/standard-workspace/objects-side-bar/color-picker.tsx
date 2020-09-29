// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React, { useState } from 'react';
import { Row, Col } from 'antd/lib/grid';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import Text from 'antd/lib/typography/Text';
import { SketchPicker } from 'react-color';
import Tooltip from 'antd/lib/tooltip';

import getCore from 'cvat-core-wrapper';

import { useTranslation } from 'react-i18next';

const core = getCore();

interface Props {
    children: React.ReactNode;
    value?: string;
    visible?: boolean;
    resetVisible?: boolean;
    onChange?: (value: string) => void;
    onVisibleChange?: (visible: boolean) => void;
    placement?: 'left' | 'top' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom' | undefined;
}

function ColorPicker(props: Props, ref: React.Ref<any>): JSX.Element {
    const { t } = useTranslation();
    const {
        children,
        value,
        visible,
        resetVisible,
        onChange,
        onVisibleChange,
        placement,
    } = props;

    const [colorState, setColorState] = useState(value);
    const [pickerVisible, setPickerVisible] = useState(false);

    const colors = [...core.enums.colors];

    const changeVisible = (_visible: boolean): void => {
        if (typeof onVisibleChange === 'function') {
            onVisibleChange(_visible);
        } else {
            setPickerVisible(_visible);
        }
    };

    return (
        <Popover
            content={(
                <>
                    <SketchPicker
                        color={colorState}
                        onChange={(color) => setColorState(color.hex)}
                        presetColors={colors}
                        ref={ref}
                        disableAlpha
                    />
                    <Row>
                        <Col span={9}>
                            {resetVisible !== false && (
                                <Button
                                    onClick={() => {
                                        if (typeof onChange === 'function') onChange('');
                                        changeVisible(false);
                                    }}
                                >
                                    {t('Reset')}
                                </Button>
                            )}
                        </Col>
                        <Col span={9}>
                            <Button
                                onClick={() => {
                                    changeVisible(false);
                                }}
                            >
                                {t('Cancel')}
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button
                                type='primary'
                                onClick={() => {
                                    if (typeof onChange === 'function') onChange(colorState || '');
                                    changeVisible(false);
                                }}
                            >
                                {t('Ok')}
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
            title={(
                <Row type='flex' justify='space-between' align='middle'>
                    <Col span={12}>
                        <Text strong>
                        {t('Select color')}
                        </Text>
                    </Col>
                    <Col span={4}>
                        <Tooltip title={t('Cancel')}>
                            <Button
                                type='link'
                                onClick={() => {
                                    changeVisible(false);
                                }}
                            >
                                <Icon type='close' />
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>

            )}
            placement={placement || 'left'}
            overlayClassName='cvat-label-color-picker'
            trigger='click'
            visible={typeof visible === 'boolean' ? visible : pickerVisible}
            onVisibleChange={changeVisible}
        >
            {children}
        </Popover>
    );
}

export default React.forwardRef(ColorPicker);
