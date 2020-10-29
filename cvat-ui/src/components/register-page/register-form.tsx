// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Form, { FormComponentProps } from 'antd/lib/form/Form';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';

import patterns from 'utils/validation-patterns';

import { UserAgreement } from 'reducers/interfaces';
import { Row, Col } from 'antd/lib/grid';
import { withTranslation, WithTranslation  } from 'react-i18next';

export interface UserConfirmation {
    name: string;
    value: boolean;
}

export interface RegisterData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password1: string;
    password2: string;
    confirmations: UserConfirmation[];
}

type RegisterFormProps = {
    fetching: boolean;
    userAgreements: UserAgreement[];
    onSubmit(registerData: RegisterData): void;
} & FormComponentProps & WithTranslation;

class RegisterFormComponent extends React.PureComponent<RegisterFormProps> {
    private validateConfirmation = (rule: any, value: any, callback: any): void => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password1')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    private validatePassword = (_: any, value: any, callback: any): void => {
        const { form } = this.props;
        if (!patterns.validatePasswordLength.pattern.test(value)) {
            callback(patterns.validatePasswordLength.message);
        }

        if (!patterns.passwordContainsNumericCharacters.pattern.test(value)) {
            callback(patterns.passwordContainsNumericCharacters.message);
        }

        if (!patterns.passwordContainsUpperCaseCharacter.pattern.test(value)) {
            callback(patterns.passwordContainsUpperCaseCharacter.message);
        }

        if (!patterns.passwordContainsLowerCaseCharacter.pattern.test(value)) {
            callback(patterns.passwordContainsLowerCaseCharacter.message);
        }

        if (value) {
            form.validateFields(['password2'], { force: true });
        }
        callback();
    };

    private validateUsername = (_: any, value: any, callback: any): void => {
        if (!patterns.validateUsernameLength.pattern.test(value)) {
            callback(patterns.validateUsernameLength.message);
        }

        if (!patterns.validateUsernameCharacters.pattern.test(value)) {
            callback(patterns.validateUsernameCharacters.message);
        }

        callback();
    };

    private validateAgrement = (agreement: any, value: any, callback: any): void => {
        const { userAgreements } = this.props;
        let isValid = true;
        for (const userAgreement of userAgreements) {
            if (agreement.field === userAgreement.name && userAgreement.required && !value) {
                isValid = false;
                callback(`You must accept the ${userAgreement.displayText} to continue!`);
                break;
            }
        }
        if (isValid) {
            callback();
        }
    };

    private handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const { form, onSubmit, userAgreements } = this.props;

        form.validateFields((error, values): void => {
            if (!error) {
                const validatedFields = {
                    ...values,
                    confirmations: [],
                };

                for (const userAgreement of userAgreements) {
                    validatedFields.confirmations.push({
                        name: userAgreement.name,
                        value: validatedFields[userAgreement.name],
                    });
                    delete validatedFields[userAgreement.name];
                }

                onSubmit(validatedFields);
            }
        });
    };

    private renderFirstNameField(): JSX.Element {
        const { form, t } = this.props;

        return (
            <Form.Item hasFeedback>
                {form.getFieldDecorator('firstName', {
                    rules: [
                        {
                            required: true,
                            message: t('Please specify a first name'),
                            pattern: patterns.validateName.pattern,
                        }
                    ],
                })(
                    <Input
                        prefix={<Icon type='user-add' style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                        placeholder={t('First name')}
                    />,
                )}
            </Form.Item>
        );
    }

    private renderLastNameField(): JSX.Element {
        const { form, t } = this.props;

        return (
            <Form.Item hasFeedback>
                {form.getFieldDecorator('lastName', {
                    rules: [
                        {
                            required: true,
                            message: t('Please specify a last name'),
                            pattern: patterns.validateName.pattern,
                        }
                    ],
                })(
                    <Input
                        prefix={<Icon type='user-add' style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                        placeholder={t('Last name')}
                    />,
                )}
            </Form.Item>
        );
    }

    private renderUsernameField(): JSX.Element {
        const { form, t } = this.props;

        return (
            <Form.Item hasFeedback>
                {form.getFieldDecorator('username', {
                    rules: [
                        {
                            required: true,
                            message: t('Please specify a username'),
                        },
                        {
                            validator: this.validateUsername,
                        }
                    ],
                })(
                    <Input
                        prefix={<Icon type='user-add' style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                        placeholder={t('Username')}
                    />,
                )}
            </Form.Item>
        );
    }

    private renderEmailField(): JSX.Element {
        const { form, t } = this.props;

        return (
            <Form.Item hasFeedback>
                {form.getFieldDecorator('email', {
                    rules: [
                        {
                            type: 'email',
                            message: t('The input is not valid E-mail!'),
                        },
                        {
                            required: true,
                            message: t('Please specify an email address'),
                        }
                    ],
                })(
                    <Input
                        autoComplete='email'
                        prefix={<Icon type='mail' style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                        placeholder={t('Email address')}
                    />,
                )}
            </Form.Item>
        );
    }

    private renderPasswordField(): JSX.Element {
        const { form, t } = this.props;

        return (
            <Form.Item hasFeedback>
                {form.getFieldDecorator('password1', {
                    rules: [
                        {
                            required: true,
                            message: t('Please input your password!'),
                        },
                        {
                            validator: this.validatePassword,
                        },
                    ],
                })(
                    <Input.Password
                        autoComplete='new-password'
                        prefix={<Icon type='lock' style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                        placeholder={t('Password')}
                    />,
                )}
            </Form.Item>
        );
    }

    private renderPasswordConfirmationField(): JSX.Element {
        const { form, t } = this.props;

        return (
            <Form.Item hasFeedback>
                {form.getFieldDecorator('password2', {
                    rules: [
                        {
                            required: true,
                            message: t('Please confirm your password!'),
                        },
                        {
                            validator: this.validateConfirmation,
                        },
                    ],
                })(
                    <Input.Password
                        autoComplete='new-password'
                        prefix={<Icon type='lock' style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                        placeholder={t('Confirm password')}
                    />,
                )}
            </Form.Item>
        );
    }

    private renderUserAgreements(): JSX.Element[] {
        const { form, userAgreements, t } = this.props;
        const getUserAgreementsElements = (): JSX.Element[] => {
            const agreementsList: JSX.Element[] = [];
            for (const userAgreement of userAgreements) {
                agreementsList.push(
                    <Form.Item key={userAgreement.name}>
                        {form.getFieldDecorator(userAgreement.name, {
                            initialValue: false,
                            valuePropName: 'checked',
                            rules: [
                                {
                                    required: true,
                                    message: t('You must accept to continue!'),
                                },
                                {
                                    validator: this.validateAgrement,
                                }
                            ],
                        })(
                            <Checkbox>
                                {t('I read and accept the')}
                                <a rel='noopener noreferrer' target='_blank' href={userAgreement.url}>
                                    {` ${userAgreement.displayText}`}
                                </a>
                            </Checkbox>,
                        )}
                    </Form.Item>,
                );
            }
            return agreementsList;
        };

        return getUserAgreementsElements();
    }

    public render(): JSX.Element {
        const { fetching, t } = this.props;

        return (
            <Form onSubmit={this.handleSubmit} className='login-form'>
                <Row gutter={8}>
                    <Col span={12}>{this.renderFirstNameField()}</Col>
                    <Col span={12}>{this.renderLastNameField()}</Col>
                </Row>
                {this.renderUsernameField()}
                {this.renderEmailField()}
                {this.renderPasswordField()}
                {this.renderPasswordConfirmationField()}
                {this.renderUserAgreements()}

                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        className='register-form-button'
                        loading={fetching}
                        disabled={fetching}
                    >
                        {t('Submit')}
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create<RegisterFormProps>()(withTranslation()(RegisterFormComponent));
