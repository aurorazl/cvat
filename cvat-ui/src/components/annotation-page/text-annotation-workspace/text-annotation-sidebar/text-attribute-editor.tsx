// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
// import { GlobalHotKeys, KeyMap } from 'react-hotkeys';
import Text from 'antd/lib/typography/Text';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Select, { SelectValue } from 'antd/lib/select';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import Input from 'antd/lib/input';

import consts from 'consts';

import { useTranslation } from 'react-i18next';
interface InputElementParameters {
    clientID: number;
    attrID: number;
    inputType: string;
    values: string[];
    currentValue: string;
    onChange(value: string): void;
}

function renderInputElement(parameters: InputElementParameters): JSX.Element {
    const { t } = useTranslation();
    const { inputType, attrID, clientID, values, currentValue, onChange } = parameters;

    const renderCheckbox = (): JSX.Element => (
        <>
            <Text strong>Checkbox: </Text>
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <Checkbox
                    onChange={(event: CheckboxChangeEvent): void => onChange(event.target.checked ? 'true' : 'false')}
                    checked={currentValue === 'true'}
                />
            </div>
        </>
    );

    const renderSelect = (): JSX.Element => (
        <>
            <Text strong>{t('Values:')} </Text>
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <Select
                    value={currentValue}
                    style={{ width: '80%' }}
                    onChange={(value: SelectValue) => onChange(value as string)}
                >
                    {values.map(
                        (value: string): JSX.Element => (
                            <Select.Option key={value} value={value}>
                                {value === consts.UNDEFINED_ATTRIBUTE_VALUE ? consts.NO_BREAK_SPACE : value}
                            </Select.Option>
                        ),
                    )}
                </Select>
            </div>
        </>
    );

    const renderRadio = (): JSX.Element => (
        <>
            <Text strong>{t('Values:')} </Text>
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <Radio.Group value={currentValue} onChange={(event: RadioChangeEvent) => onChange(event.target.value)}>
                    {values.map(
                        (value: string): JSX.Element => (
                            <Radio style={{ display: 'block' }} key={value} value={value}>
                                {value === consts.UNDEFINED_ATTRIBUTE_VALUE ? consts.NO_BREAK_SPACE : value}
                            </Radio>
                        ),
                    )}
                </Radio.Group>
            </div>
        </>
    );

    const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Tab', 'Shift', 'Control'].includes(event.key)) {
            event.preventDefault();
            const copyEvent = new KeyboardEvent('keydown', event);
            window.document.dispatchEvent(copyEvent);
        }
    };

    const renderText = (): JSX.Element => (
        <>
            {inputType === 'number' ? <Text strong>{t('Number:')} </Text> : <Text strong>{t('Text:')} </Text>}
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <Input
                    autoFocus
                    key={`${clientID}:${attrID}`}
                    defaultValue={currentValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const { value } = event.target;
                        if (inputType === 'number') {
                            if (value !== '') {
                                const numberValue = +value;
                                if (!Number.isNaN(numberValue)) {
                                    onChange(`${numberValue}`);
                                }
                            }
                        } else {
                            onChange(value);
                        }
                    }}
                    onKeyDown={handleKeydown}
                />
            </div>
        </>
    );

    let element = null;
    if (inputType === 'checkbox') {
        element = renderCheckbox();
    } else if (inputType === 'select') {
        element = renderSelect();
    } else if (inputType === 'radio') {
        element = renderRadio();
    } else {
        element = renderText();
    }

    return <div className='attribute-annotation-sidebar-attr-editor'>{element}</div>;
}

interface Props {
    clientID: number;
    attribute: any;
    currentValue: string;
    onChange(value: string): void;
}

function TextAttributeEditor(props: Props): JSX.Element {
    const { attribute, currentValue, onChange, clientID } = props;
    const { inputType, values, id: attrID } = attribute;

    return (
        <div>
            {renderInputElement({
                clientID,
                attrID,
                inputType,
                currentValue,
                values,
                onChange,
            })}
        </div>
    );
}

export default React.memo(TextAttributeEditor);
