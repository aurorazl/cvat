// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';
import { useTranslation } from 'react-i18next';
import HelpLink from 'components/help-link';
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts'

export default function TopBarComponent(): JSX.Element {
    const { t } = useTranslation();
    const core = getCore();
    const baseURL = core.config.backendAPI.slice(0, -7);    
    return (
        <Row type='flex' justify='center' align='middle'>
            <Col md={22} lg={20} xl={16} xxl={14}>
                <Text className='cvat-title'>{t('Models')}</Text>
                <HelpLink helpLink={`${baseURL}/${linkConsts.MODELS_URL}`} styles={{position: 'absolute', top: 10, right: 10}}/>                
            </Col>
        </Row>
    );
}
