// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd/lib/grid';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Text from 'antd/lib/typography/Text';

import { useTranslation } from 'react-i18next';

import HelpLink from '../help-link';
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts'

interface VisibleTopBarProps {
    onSearch: (value: string) => void;
    searchValue: string;
}
interface Props {
    lang: string;
}

function TopBarComponent(props: VisibleTopBarProps & RouteComponentProps & Props): JSX.Element {
    const { t } = useTranslation();
    const core = getCore();
    const baseURL = core.config.backendAPI.slice(0, -7);

    const { searchValue, history, onSearch, lang } = props;

    return (
        <>
            <Row type='flex' justify='center' align='middle'>
                <Col md={22} lg={18} xl={16} xxl={14}>
                    <Text strong>{t('Default project')}</Text>
                </Col>
            </Row>
            <Row type='flex' justify='center' align='middle'>
                <Col md={11} lg={9} xl={8} xxl={7}>
                    <Text className='cvat-title'>{t('Tasks')}</Text>
                    <Input.Search defaultValue={searchValue} onSearch={onSearch} size='large' placeholder={t('Search')}/>
                    <HelpLink helpLink={`${baseURL}/${linkConsts[lang].SEARCH_URL}`} styles={{marginLeft: 10}}/>
                </Col>
                <Col md={{ span: 11 }} lg={{ span: 9 }} xl={{ span: 8 }} xxl={{ span: 7 }}>
                    <Button
                        size='large'
                        id='cvat-create-task-button'
                        type='primary'
                        onClick={(): void => history.push('/tasks/create')}
                        icon='plus'
                    >
                         {t('Create new task')}
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default withRouter(TopBarComponent);
