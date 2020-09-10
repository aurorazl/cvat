// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import Icon from 'antd/lib/icon';

import consts from 'consts';
import { EmptyTasksIcon as EmptyModelsIcon } from 'icons';
import { useTranslation } from 'react-i18next';
import { isZh } from 'utils/lang-utils';

export default function EmptyListComponent(): JSX.Element {
    const { t } = useTranslation();
    return (
        <div className='cvat-empty-models-list'>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    <Icon className='cvat-empty-models-icon' component={EmptyModelsIcon} />
                </Col>
            </Row>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    <Text strong>{t('No models deployed yet...')}</Text>
                </Col>
            </Row>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    <Text type='secondary'>{t('To annotate your tasks automatically')}</Text>
                </Col>
            </Row>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    { isZh() ? 
                        <Text type='secondary'>
                            请使用 <a href={`${consts.NUCLIO_GUIDE}`}>nuclio</a> 部署模型
                        </Text> :
                        <Text type='secondary'>deploy a model with &nbsp;
                            <a href={`${consts.NUCLIO_GUIDE}`}>nuclio</a>
                        </Text>
                    }
                </Col>
            </Row>
        </div>
    );
}
