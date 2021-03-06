// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Form, { FormComponentProps } from 'antd/lib/form/Form';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import { withTranslation, WithTranslation  } from 'react-i18next';

export interface LoginData {
    username: string;
    password: string;
}

type LoginFormProps = {
    fetching: boolean;
    onSubmit(loginData: LoginData): void;
} & FormComponentProps & WithTranslation;

class LoginFormComponent extends React.PureComponent<LoginFormProps> {
    private handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const { form, onSubmit } = this.props;

        form.validateFields((error, values): void => {
            if (!error) {
                onSubmit(values);
            }
        });
    };

    private renderUsernameField(): JSX.Element {
        const { form, t } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form.Item hasFeedback>
                {getFieldDecorator('username', {
                    rules: [
                        {
                            required: true,
                            message: t('Please specify a username'),
                        },
                    ],
                })(
                    <Input
                        autoComplete='username'
                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder={t('Username')}
                    />,
                )}
            </Form.Item>
        );
    }

    private renderPasswordField(): JSX.Element {
        const { form, t } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form.Item hasFeedback>
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: t('Please specify a password'),
                        },
                ],
                })(
                    <Input
                        autoComplete='current-password'
                        prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder={t('Password')}
                        type='password'
                    />,
                )}
            </Form.Item>
        );
    }

    public render(): JSX.Element {
        const { fetching, t } = this.props;
        return (
            <Form onSubmit={this.handleSubmit} className='login-form'>
                {this.renderUsernameField()}
                {this.renderPasswordField()}

                <Form.Item>
                    <Button
                        type='primary'
                        loading={fetching}
                        disabled={fetching}
                        htmlType='submit'
                        className='login-form-button'
                    >
                        {t('Sign in')}
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create<LoginFormProps>()(withTranslation()(LoginFormComponent));
