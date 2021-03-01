// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';

import { UserAgreement } from 'reducers/interfaces';
import CookieDrawer from 'components/login-page/cookie-policy-drawer';
import RegisterForm, { RegisterData, UserConfirmation } from './register-form';
import { useTranslation } from 'react-i18next';
interface RegisterPageComponentProps {
    fetching: boolean;
    userAgreements: UserAgreement[];
    onRegister: (
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password1: string,
        password2: string,
        confirmations: UserConfirmation[],
    ) => void;
}

function RegisterPageComponent(props: RegisterPageComponentProps & RouteComponentProps): JSX.Element {
    const { t } = useTranslation();
    const sizes = {
        xs: { span: 14 },
        sm: { span: 14 },
        md: { span: 10 },
        lg: { span: 6 },
        xl: { span: 5 },
    };

    const { fetching, userAgreements, onRegister } = props;

    return (
        <>
            <Row type='flex' justify='center' align='middle'>
                <Col {...sizes}>
                    <Title level={2}> {t('Create an account')} </Title>
                    <RegisterForm
                        fetching={fetching}
                        userAgreements={userAgreements}
                        onSubmit={(registerData: RegisterData): void => {
                            onRegister(
                                registerData.username,
                                registerData.firstName,
                                registerData.lastName,
                                registerData.email,
                                registerData.password1,
                                registerData.password2,
                                registerData.confirmations,
                            );
                        }}
                    />
                    <Row type='flex' justify='start' align='top'>
                        <Col>
                            <Text strong>
                                {t('Already have an account?')}
                                <Link to='/auth/login'> {t('Login')} </Link>
                            </Text>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <CookieDrawer />
        </>
    );
}

export default withRouter(RegisterPageComponent);
