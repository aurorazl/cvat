// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import Icon from 'antd/lib/icon';

import { EmptyTasksIcon } from 'icons';

import { useTranslation } from 'react-i18next';

export default function EmptyListComponent(): JSX.Element {
    const { t } = useTranslation();
    return (
        <div className='cvat-empty-tasks-list'>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    <Icon className='cvat-empty-tasks-icon' component={EmptyTasksIcon} />
                </Col>
            </Row>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    <Text strong>{t('No tasks created yet ...')}</Text>
                </Col>
            </Row>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    <Text type='secondary'>{t('To get started with your annotation project')}</Text>
                </Col>
            </Row>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    <Link to='/tasks/create'>{t('create a new task')}</Link>
                </Col>
            </Row>
        </div>
    );
}
