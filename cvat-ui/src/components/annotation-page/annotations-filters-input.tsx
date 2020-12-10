// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { connect } from 'react-redux';
import Select, { SelectValue, LabeledValue } from 'antd/lib/select';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import Paragraph from 'antd/lib/typography/Paragraph';
import Tooltip from 'antd/lib/tooltip';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';

import {
    changeAnnotationsFilters as changeAnnotationsFiltersAction,
    fetchAnnotationsAsync,
} from 'actions/annotation-actions';
import { CombinedState } from 'reducers/interfaces';

import { useTranslation } from 'react-i18next';
import HelpLink from 'components/help-link';
import getCore from 'cvat-core-wrapper';
import linkConsts from 'help-link-consts';

interface StateToProps {
    annotationsFilters: string[];
    annotationsFiltersHistory: string[];
    searchForwardShortcut: string;
    searchBackwardShortcut: string;
    lang: string;
}

interface DispatchToProps {
    changeAnnotationsFilters(value: SelectValue): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            annotations: { filters: annotationsFilters, filtersHistory: annotationsFiltersHistory },
        },
        shortcuts: { normalizedKeyMap },
        lang: {lang}
    } = state;

    return {
        lang,
        annotationsFilters,
        annotationsFiltersHistory,
        searchForwardShortcut: normalizedKeyMap.SEARCH_FORWARD,
        searchBackwardShortcut: normalizedKeyMap.SEARCH_BACKWARD,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        changeAnnotationsFilters(value: SelectValue) {
            if (typeof value === 'string') {
                dispatch(changeAnnotationsFiltersAction([value]));
                dispatch(fetchAnnotationsAsync());
            } else if (
                Array.isArray(value) &&
                value.every((element: string | number | LabeledValue): boolean => typeof element === 'string')
            ) {
                dispatch(changeAnnotationsFiltersAction(value as string[]));
                dispatch(fetchAnnotationsAsync());
            }
        },
    };
}

function filtersHelpModalContent(searchForwardShortcut: string, searchBackwardShortcut: string, lang: string): JSX.Element {
    const { t } = useTranslation();
    return (
        <>
            <Paragraph>
                <Title level={3}>{t('General')}</Title>
            </Paragraph>
            { lang === 'zh-CN' ?
                <Paragraph>
                    你可以使用过滤器仅显示帧上的对象子集或者使用热键
                    <Text strong>{` ${searchForwardShortcut} `}</Text>
                    和
                    <Text strong>{` ${searchBackwardShortcut} `}</Text>
                    来搜索满足过滤条件的对象。
                </Paragraph> :
                <Paragraph>
                    You can use filters to display only subset of objects on a frame or to search objects that satisfy the
                    filters using hotkeys
                    <Text strong>{` ${searchForwardShortcut} `}</Text>
                    and
                    <Text strong>{` ${searchBackwardShortcut} `}</Text>
                </Paragraph>
            }
            { lang === 'zh-CN' ?
                <Paragraph>
                    <Text strong>支持的属性：</Text>
                    width, height, label, serverID, clientID, type, shape, occluded
                    <br />
                    <Text strong>支持的操作：</Text>
                        ==, !=, &gt;, &gt;=, &lt;, &lt;=, (), &amp; 和 |
                    <br />
                    <Text strong>
                        如果查询字符串中包含双引号，
                        请使用反斜线\&quot;进行转义:  (查看最新的例子)
                    </Text>
                    <br />
                    所有属性和值均区分大小写。
                    CVAT使用json查询执行搜索。
                </Paragraph> :
                <Paragraph>
                    <Text strong>Supported properties: </Text>
                    width, height, label, serverID, clientID, type, shape, occluded
                    <br />
                    <Text strong>Supported operators: </Text>
                        ==, !=, &gt;, &gt;=, &lt;, &lt;=, (), &amp; and |
                    <br />
                    <Text strong>
                        If you have double quotes in your query string, please escape them using back slash: \&quot; (see
                        the latest example)
                    </Text>
                    <br />
                    All properties and values are case-sensitive. CVAT uses json queries to perform search.
                </Paragraph>
            }
            <Paragraph>
                <Title level={3}>{t('Examples')}</Title>
                <ul>
                    <li>label==&quot;car&quot; | label==[&quot;road sign&quot;]</li>
                    <li>shape == &quot;polygon&quot;</li>
                    <li>width &gt;= height</li>
                    <li>attr[&quot;Attribute 1&quot;] == attr[&quot;Attribute 2&quot;]</li>
                    <li>clientID == 50</li>
                    <li>
                        (label==&quot;car&quot; &amp; attr[&quot;parked&quot;]==true) | (label==&quot;pedestrian&quot;
                        &amp; width &gt; 150)
                    </li>
                    <li>
                        (( label==[&quot;car \&quot;mazda\&quot;&quot;]) &amp; (attr[&quot;sunglasses&quot;]==true |
                        (width &gt; 150 | height &gt; 150 &amp; (clientID == serverID)))))
                    </li>
                </ul>
            </Paragraph>
        </>
    );
}

function AnnotationsFiltersInput(props: StateToProps & DispatchToProps): JSX.Element {
    const { t } = useTranslation();
    const core = getCore();
    const baseURL = core.config.backendAPI.slice(0, -7);

    const {
        annotationsFilters,
        annotationsFiltersHistory,
        searchForwardShortcut,
        searchBackwardShortcut,
        changeAnnotationsFilters,
        lang,
    } = props;

    const [underCursor, setUnderCursor] = useState(false);

    const modalContent = filtersHelpModalContent(
        searchForwardShortcut,
        searchBackwardShortcut,
        lang,
    );

    return (
        <>
        <Select
            className='cvat-annotations-filters-input'
            allowClear
            value={annotationsFilters}
            mode='tags'
            style={{ width: '95%' }}
            placeholder={
                underCursor ? (
                    <>
                        <Tooltip title={t('Click to open help')} mouseLeaveDelay={0}>
                            <Icon
                                type='filter'
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    Modal.info({
                                        width: 700,
                                        title: t('How to use filters?'),
                                        content: modalContent,
                                    });
                                }}
                            />
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Icon style={{ transform: 'scale(0.9)' }} type='filter' />
                        <span style={{ marginLeft: 5 }}>{t('Annotations filters')}</span>
                    </>
                )
            }
            onChange={changeAnnotationsFilters}
            onMouseEnter={() => setUnderCursor(true)}
            onMouseLeave={() => setUnderCursor(false)}
        >
            {annotationsFiltersHistory.map(
                (element: string): JSX.Element => (
                    <Select.Option key={element} value={element}>
                        {element}
                    </Select.Option>
                ),
            )}
        </Select>
        <HelpLink helpLink={`${baseURL}/${linkConsts[lang].FILTER_URL}`} styles={{display:'inline-block', width: '5%', position: 'absolute'}}/>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationsFiltersInput);
