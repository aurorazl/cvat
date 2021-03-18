// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Input from 'antd/lib/input';
import Form, { FormComponentProps } from 'antd/lib/form/Form';
import { withTranslation, WithTranslation  } from 'react-i18next';

export interface BaseConfiguration {
    name: string;
}

type Props = FormComponentProps & {
    onSubmit(values: BaseConfiguration): void;
    name: string | undefined;
};

class BasicConfigurationForm extends React.PureComponent<Props & WithTranslation> {
    public submit(): Promise<void> {
        return new Promise((resolve, reject) => {
            const { form, onSubmit } = this.props;

            form.validateFields((error, values): void => {
                if (!error) {
                    onSubmit({
                        name: values.name,
                    });
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    public resetFields(): void {
        const { form } = this.props;
        form.resetFields();
    }

    public render(): JSX.Element {
        const { form, t, name } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form onSubmit={(e: React.FormEvent): void => e.preventDefault()}>
                <Form.Item hasFeedback label={<span>{t('Name')}</span>}>
                    { getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: t('Please, specify a name'),
                            },
                        ],
                        initialValue: name ||'',
                    })(<Input disabled={!!name}/>) }
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create<Props>()(withTranslation(undefined, { withRef: true })(BasicConfigurationForm));
