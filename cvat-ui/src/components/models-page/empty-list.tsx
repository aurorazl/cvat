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
import { CombinedState } from 'reducers/interfaces';
import { connect } from 'react-redux';

interface StateToProps {
    lang: string;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        lang: {lang}
    } = state;

    return {
        lang
    };
}

 function EmptyListComponent(props: StateToProps): JSX.Element {
    const { t } = useTranslation();
    const { lang } = props;

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
                    <Text type='secondary'>{t('deploy a model with kfserving')}</Text>
                </Col>
            </Row>
        </div>
    );
}

export default connect(mapStateToProps)(EmptyListComponent);