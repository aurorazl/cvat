// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import { Empty } from 'antd';

import { useTranslation } from 'react-i18next';

export default function NoTaskFoundComponent(): JSX.Element {
    const { t } = useTranslation();
    return (
        <div className='cvat-empty-tasks-list'>
            <Row type='flex' justify='center' align='middle'>
                <Col>
                    <Empty description={t('No task found...')} />
                </Col>
            </Row>
        </div>
    );
}
