// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import Text from 'antd/lib/typography/Text';
import { useTranslation } from 'react-i18next';
import HelpLink from 'components/help-link';
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts';

interface Props {
    labels: any[];
    selectedLabeID: number;
    repeatShapeShortcut: string;
    onChangeLabel(value: string): void;
    onSetup(labelID: number): void;
    lang: string;
}

function SetupTagPopover(props: Props): JSX.Element {
    const { t } = useTranslation();
    const core = getCore();
    const baseURL = core.config.backendAPI.slice(0, -7);

    const { labels, selectedLabeID, repeatShapeShortcut, onChangeLabel, onSetup, lang } = props;

    return (
        <div className='cvat-draw-shape-popover-content'>
            <Row type='flex' justify='space-between'>
                <Col>
                    <Text className='cvat-text-color' strong>
                        {t('Setup tag')}
                    </Text>
                </Col>
                <Col>
                    <HelpLink helpLink={`${baseURL}/${linkConsts[lang].ANNOTATION_WITH_TAGS_URL}`}/>
                </Col>
            </Row>
            <Row type='flex' justify='start'>
                <Col>
                    <Text className='cvat-text-color'>{t('controlsSidebar::Label')}</Text>
                </Col>
            </Row>
            <Row type='flex' justify='center'>
                <Col span={24}>
                    <Select value={`${selectedLabeID}`} onChange={onChangeLabel}>
                        {labels.map((label: any) => (
                            <Select.Option key={label.id} value={`${label.id}`}>
                                {label.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Row type='flex' justify='space-around'>
                <Col span={24}>
                    <Tooltip title={t('Press ${repeatShapeShortcut} to add a tag again').replace('${repeatShapeShortcut}', `${repeatShapeShortcut}`)} mouseLeaveDelay={0}>
                        <Button onClick={() => onSetup(selectedLabeID)}>{t('Tag')}</Button>
                    </Tooltip>
                </Col>
            </Row>
        </div>
    );
}

export default React.memo(SetupTagPopover);
