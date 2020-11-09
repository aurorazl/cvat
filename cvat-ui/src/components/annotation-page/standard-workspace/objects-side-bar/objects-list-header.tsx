// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Icon from 'antd/lib/icon';
import Select from 'antd/lib/select';
import Text from 'antd/lib/typography/Text';
import Tooltip from 'antd/lib/tooltip';

import AnnotationsFiltersInput from 'components/annotation-page/annotations-filters-input';
import { StatesOrdering } from 'reducers/interfaces';
import { useTranslation } from 'react-i18next';
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts';

interface StatesOrderingSelectorComponentProps {
    statesOrdering: StatesOrdering;
    changeStatesOrdering(value: StatesOrdering): void;
}

function StatesOrderingSelectorComponent(props: StatesOrderingSelectorComponentProps): JSX.Element {
    const { t } = useTranslation();
    const { statesOrdering, changeStatesOrdering } = props;

    return (
        <Col span={16}>
            <Text strong>{t('Sort by')}</Text>
            <Select value={statesOrdering} onChange={changeStatesOrdering}>
                <Select.Option key={StatesOrdering.ID_DESCENT} value={StatesOrdering.ID_DESCENT}>
                    {t(StatesOrdering.ID_DESCENT)}
                </Select.Option>
                <Select.Option key={StatesOrdering.ID_ASCENT} value={StatesOrdering.ID_ASCENT}>
                    {t(StatesOrdering.ID_ASCENT)}
                </Select.Option>
                <Select.Option key={StatesOrdering.UPDATED} value={StatesOrdering.UPDATED}>
                    {t(StatesOrdering.UPDATED)}
                </Select.Option>
            </Select>
        </Col>
    );
}

const StatesOrderingSelector = React.memo(StatesOrderingSelectorComponent);
const core = getCore();
const baseURL = core.config.backendAPI.slice(0, -7);

interface Props {
    statesHidden: boolean;
    statesLocked: boolean;
    statesCollapsed: boolean;
    statesOrdering: StatesOrdering;
    switchLockAllShortcut: string;
    switchHiddenAllShortcut: string;
    changeStatesOrdering(value: StatesOrdering): void;
    lockAllStates(): void;
    unlockAllStates(): void;
    collapseAllStates(): void;
    expandAllStates(): void;
    hideAllStates(): void;
    showAllStates(): void;
}

function ObjectListHeader(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        statesHidden,
        statesLocked,
        statesCollapsed,
        statesOrdering,
        switchLockAllShortcut,
        switchHiddenAllShortcut,
        changeStatesOrdering,
        lockAllStates,
        unlockAllStates,
        collapseAllStates,
        expandAllStates,
        hideAllStates,
        showAllStates,
    } = props;

    return (
        <div className='cvat-objects-sidebar-states-header'>
            <Row>
                <Col>
                    <AnnotationsFiltersInput />
                </Col>
            </Row>
            <Row type='flex' justify='space-between' align='middle'>
                <Col span={2}>
                    <Tooltip title={<a href={`${baseURL}/${linkConsts.OBJECTS}`} target="blank">{t('Switch lock property for all ${switchLockAllShortcut}', {switchLockAllShortcut: `${switchLockAllShortcut}`})}</a>} mouseLeaveDelay={0.2}>
                        { statesLocked ? (
                                <Icon type='lock' onClick={unlockAllStates} theme='filled' />
                            ) : (
                                <Icon type='unlock' onClick={lockAllStates} />
                        )}
                    </Tooltip>
                </Col>
                <Col span={2}>
                    <Tooltip title={<a href={`${baseURL}/${linkConsts.OBJECTS}`} target="blank">{t('Switch hidden property for all ${switchHiddenAllShortcut}', {switchHiddenAllShortcut: `${switchHiddenAllShortcut}`})}</a>} mouseLeaveDelay={0.2}>
                        { statesHidden ? (
                                <Icon type='eye-invisible' onClick={showAllStates} />
                            ) : (
                                <Icon type='eye' onClick={hideAllStates} />
                            )}
                    </Tooltip>
                </Col>
                <Col span={2}>
                            <Tooltip title={<a href={`${baseURL}/${linkConsts.OBJECTS}`} target="blank">{t('Expand/collapse all')}</a>} mouseLeaveDelay={0.2}>
                        { statesCollapsed ? (
                                <Icon type='caret-down' onClick={expandAllStates} />
                            ) : (
                                <Icon type='caret-up' onClick={collapseAllStates} />
                            )}
                    </Tooltip>
                </Col>
                <StatesOrderingSelector statesOrdering={statesOrdering} changeStatesOrdering={changeStatesOrdering} />
            </Row>
        </div>
    );
}

export default React.memo(ObjectListHeader);
