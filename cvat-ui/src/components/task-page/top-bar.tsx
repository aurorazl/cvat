// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import Text from 'antd/lib/typography/Text';

import ActionsMenuContainer from 'containers/actions-menu/actions-menu';
import { MenuIcon } from 'icons';
import { useTranslation } from 'react-i18next';

interface DetailsComponentProps {
    taskInstance: any;
}

export default function DetailsComponent(props: DetailsComponentProps): JSX.Element {
    const { t } = useTranslation();
    const { taskInstance } = props;
    const { id } = taskInstance;

    return (
        <Row className='cvat-task-top-bar' type='flex' justify='space-between' align='middle'>
            <Col>
                <Text className='cvat-title'>{t('Task details #${id}').replace('${id}', `${id}`)}</Text>
            </Col>
            <Col>
                <Dropdown overlay={<ActionsMenuContainer taskInstance={taskInstance} />}>
                    <Button size='large'>
                        <Text className='cvat-text-color'>{t('Actions')}</Text>
                        <Icon className='cvat-menu-icon' component={MenuIcon} />
                    </Button>
                </Dropdown>
            </Col>
        </Row>
    );
}
