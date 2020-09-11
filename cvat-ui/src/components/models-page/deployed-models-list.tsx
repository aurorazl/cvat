// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';

import { Model } from 'reducers/interfaces';
import DeployedModelItem from './deployed-model-item';
import { useTranslation } from 'react-i18next';

interface Props {
    models: Model[];
}

export default function DeployedModelsListComponent(props: Props): JSX.Element {
    const { t } = useTranslation();
    const { models } = props;

    const items = models.map((model): JSX.Element => (
        <DeployedModelItem key={model.id} model={model} />
    ));

    return (
        <>
            <Row type='flex' justify='center' align='middle'>
                <Col md={22} lg={18} xl={16} xxl={14} className='cvat-models-list'>
                    <Row type='flex' align='middle' style={{ padding: '10px' }}>
                        <Col span={3}>
                            <Text strong>{t('Framework')}</Text>
                        </Col>
                        <Col span={3}>
                            <Text strong>{t('Name')}</Text>
                        </Col>
                        <Col span={3}>
                            <Text strong>{t('Type')}</Text>
                        </Col>
                        <Col span={10}>
                            <Text strong>{t('Description')}</Text>
                        </Col>
                        <Col span={5}>
                            <Text strong>{t('Labels')}</Text>
                        </Col>
                    </Row>
                    { items }
                </Col>
            </Row>
        </>
    );
}
