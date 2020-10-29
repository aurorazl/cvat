// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Tag from 'antd/lib/tag';
import Select from 'antd/lib/select';
import Text from 'antd/lib/typography/Text';
import { Model } from 'reducers/interfaces';
import { useTranslation } from 'react-i18next';

interface Props {
    model: Model;
}

export default function DeployedModelItem(props: Props): JSX.Element {
    const { t } = useTranslation();
    const { model } = props;

    return (
        <Row className='cvat-models-list-item' type='flex'>
            <Col span={3}>
                <Tag color='purple'>{model.framework}</Tag>
            </Col>
            <Col span={3}>
                <Text className='cvat-text-color'>{model.name}</Text>
            </Col>
            <Col span={3}>
                <Tag color='orange'>{model.type}</Tag>
            </Col>
            <Col span={10}>
                <Text style={{ whiteSpace: 'normal', height: 'auto' }}>{model.description}</Text>
            </Col>
            <Col span={5}>
                <Select showSearch placeholder={t('Supported labels')} style={{ width: '90%' }} value={t('Supported labels')}>
                    {model.labels.map(
                        (label): JSX.Element => (
                            <Select.Option key={label}>{label}</Select.Option>
                        ),
                    )}
                </Select>
            </Col>
        </Row>
    );
}
