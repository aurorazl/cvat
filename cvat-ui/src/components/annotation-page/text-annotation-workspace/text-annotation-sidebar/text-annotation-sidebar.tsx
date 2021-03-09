// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { GlobalHotKeys, ExtendedKeyMapOptions } from 'react-hotkeys';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Row, Col } from 'antd/lib/grid';
import Layout, { SiderProps } from 'antd/lib/layout';
import Button from 'antd/lib/button/button';
import Icon from 'antd/lib/icon';
import Text from 'antd/lib/typography/Text';
import Select from 'antd/lib/select';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import Input from 'antd/lib/input';
import TextAttributeEditor from './text-attribute-editor';
import { LogType } from 'cvat-logger';
import {
    createAnnotationsAsync,
    removeObjectAsync,
    changeFrameAsync,
    rememberObject,
    updateAnnotationsAsync,
    activateObject as activateObjectAction,
} from 'actions/annotation-actions';
import { Canvas } from 'cvat-canvas-wrapper';
import { CombinedState, ObjectType } from 'reducers/interfaces';
import Tag from 'antd/lib/tag';
import getCore from 'cvat-core-wrapper';
// import ShortcutsSelect from './shortcuts-select';
import { useTranslation, Trans } from 'react-i18next';
import HelpLink from 'components/help-link';
import linkConsts from 'help-link-consts';

const cvat = getCore();

interface StateToProps {
    activatedStateID: number | null;
    activatedAttributeID: number | null;
    states: any[];
    labels: any[];
    jobInstance: any;
    canvasInstance: Canvas;
    frameNumber: number;
    keyMap: Record<string, ExtendedKeyMapOptions>;
    normalizedKeyMap: Record<string, string>;
    lang: string;
    curZLayer: number;
    canvasIsReady: boolean;
}

interface DispatchToProps {
    removeObject(jobInstance: any, objectState: any): void;
    createAnnotations(jobInstance: any, frame: number, objectStates: any[]): void;
    changeFrame(frame: number, fillBuffer?: boolean, frameStep?: number): void;
    onRememberObject(labelID: number): void;
    updateAnnotations(statesToUpdate: any[]): void;
    activateObject(clientID: number | null, attrID: number | null): void;
}
interface LabelAttrMap {
    [index: number]: any;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            player: {
                frame: { number: frameNumber },
            },
            annotations: {
                activatedStateID,
                activatedAttributeID,
                states,
                zLayer: { cur },
            },
            job: { instance: jobInstance, labels },
            canvas: { instance: canvasInstance, ready: canvasIsReady },
        },
        shortcuts: { keyMap, normalizedKeyMap },
        lang: { lang },
    } = state;

    return {
        jobInstance,
        labels,
        activatedStateID,
        activatedAttributeID,
        states,
        canvasInstance,
        frameNumber,
        keyMap,
        normalizedKeyMap,
        lang,
        canvasIsReady,
        curZLayer: cur,
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<CombinedState, {}, Action>): DispatchToProps {
    return {
        changeFrame(frame: number, fillBuffer?: boolean, frameStep?: number): void {
            dispatch(changeFrameAsync(frame, fillBuffer, frameStep));
        },
        createAnnotations(jobInstance: any, frame: number, objectStates: any[]): void {
            dispatch(createAnnotationsAsync(jobInstance, frame, objectStates));
        },
        removeObject(jobInstance: any, objectState: any): void {
            dispatch(removeObjectAsync(jobInstance, objectState, true));
        },
        onRememberObject(labelID: number): void {
            dispatch(rememberObject(ObjectType.TAG, labelID));
        },
        updateAnnotations(states): void {
            dispatch(updateAnnotationsAsync(states));
        },
        activateObject(clientID: number, attrID: number): void {
            dispatch(activateObjectAction(clientID, attrID));
        },
    };
}

function TextAnnotationSidebar(props: StateToProps & DispatchToProps): JSX.Element {
    const { t } = useTranslation();
    const baseURL = cvat.config.backendAPI.slice(0, -7);

    const {
        states,
        activatedStateID,
        activatedAttributeID,
        labels,
        removeObject,
        jobInstance,
        changeFrame,
        canvasInstance,
        frameNumber,
        onRememberObject,
        createAnnotations,
        keyMap,
        lang,
        updateAnnotations,
        curZLayer,
        activateObject,
        canvasIsReady,
    } = props;

    const filteredStates = states.filter((state) => !state.outside && !state.hidden && state.zOrder <= curZLayer);
    const [labelAttrMap, setLabelAttrMap] = useState(
        labels.reduce((acc, label): LabelAttrMap => {
            acc[label.id] = label.attributes.length ? label.attributes[0] : null;
            return acc;
        }, {}),
    );
    const indexes = filteredStates.map((state) => state.clientID);
    const activatedIndex = indexes.indexOf(activatedStateID);
    const activeObjectState =
        activatedStateID === null || activatedIndex === -1 ? null : filteredStates[activatedIndex];
        console.log('text-attribute-annotation', activeObjectState);
    const activeAttribute = activeObjectState ? labelAttrMap[activeObjectState.label.id] : null;

    if (canvasIsReady) {
        if (activeObjectState) {
            const attribute = labelAttrMap[activeObjectState.label.id];
            if (attribute && attribute.id !== activatedAttributeID) {
                activateObject(activatedStateID, attribute ? attribute.id : null);
            }
        } else if (filteredStates.length) {
            const attribute = labelAttrMap[filteredStates[0].label.id];
            activateObject(filteredStates[0].clientID, attribute ? attribute.id : null);
        }
    }

    const preventDefault = (event: KeyboardEvent | undefined): void => {
        if (event) {
            event.preventDefault();
        }
    };

    const defaultLabelID = labels[0].id;

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    // const [frameTags, setFrameTags] = useState([] as any[]);
    const [selectedLabelID, setSelectedLabelID] = useState(defaultLabelID);
    const [skipFrame, setSkipFrame] = useState(false);

    useEffect(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, []);

    useEffect(() => {
        const listener = (event: Event): void => {
            if (
                (event as TransitionEvent).propertyName === 'width' &&
                ((event.target as any).classList as DOMTokenList).contains('cvat-text-annotation-sidebar')
            ) {
                canvasInstance.fitCanvas();
                canvasInstance.fit();
            }
        };

        const [sidebar] = window.document.getElementsByClassName('cvat-text-annotation-sidebar');

        sidebar.addEventListener('transitionend', listener);

        return () => {
            sidebar.removeEventListener('transitionend', listener);
        };
    }, []);

    // useEffect(() => {
    //     setFrameTags(states.filter((objectState: any): boolean => objectState.objectType === ObjectType.TAG));
    // }, [states]);

    const siderProps: SiderProps = {
        className: 'cvat-text-annotation-sidebar',
        theme: 'light',
        width: 300,
        collapsedWidth: 0,
        reverseArrow: true,
        collapsible: true,
        trigger: null,
        collapsed: sidebarCollapsed,
    };

    const onChangeLabel = (value: string): void => {
        setSelectedLabelID(Number.parseInt(value, 10));
    };

    const onRemoveState = (objectState: any): void => {
        removeObject(jobInstance, objectState);
    };

    const onChangeFrame = (): void => {
        const frame = Math.min(jobInstance.stopFrame, frameNumber + 1);

        if (canvasInstance.isAbleToChangeFrame()) {
            changeFrame(frame);
        }
    };

    const onAddTag = (labelID: number): void => {
        onRememberObject(labelID);

        const objectState = new cvat.classes.ObjectState({
            objectType: ObjectType.TAG,
            label: labels.filter((label: any) => label.id === labelID)[0],
            frame: frameNumber,
        });

        createAnnotations(jobInstance, frameNumber, [objectState]);

        if (skipFrame) onChangeFrame();
    };

    const subKeyMap = {
        SWITCH_DRAW_MODE: keyMap.SWITCH_DRAW_MODE,
    };

    const handlers = {
        SWITCH_DRAW_MODE: (event: KeyboardEvent | undefined) => {
            preventDefault(event);
            onAddTag(selectedLabelID);
        },
    };

    return (
        <>
            <GlobalHotKeys keyMap={subKeyMap} handlers={handlers} allowChanges />
            <Layout.Sider {...siderProps}>
                <HelpLink helpLink={`${baseURL}/${linkConsts[lang].ANNOTATION_WITH_TAGS_URL}`}/>
                {/* eslint-disable-next-line */}
                <span
                    className={`cvat-objects-sidebar-sider
                        ant-layout-sider-zero-width-trigger
                        ant-layout-sider-zero-width-trigger-left`}
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                    {sidebarCollapsed ? (
                        <Icon type='menu-fold' title={t('Show')} />
                    ) : (
                        <Icon type='menu-unfold' title={t('Hide')} />
                    )}
                </span>
                <Row type='flex' justify='start' className='cvat-text-annotation-sidebar-label-select'>
                    <Col>
                        <Text strong>{t('Text Label')}</Text>
                        <Select value={`${selectedLabelID}`} onChange={onChangeLabel} size='default'>
                            {labels.map((label: any) => (
                                <Select.Option key={label.id} value={`${label.id}`}>
                                    {label.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Row type='flex' justify='start' className='cvat-text-annotation-sidebar-text-input'>
                    <Col>
                        {/* <Text strong>{t('Text Value')}</Text>
                        <Input></Input> */}
                        {activeObjectState && (<TextAttributeEditor
                            clientID={activeObjectState?.clientID}
                            attribute={activeAttribute}
                            currentValue={activeObjectState?.attributes[activeAttribute.id]}
                            onChange={(value: string) => {
                                const { attributes } = activeObjectState;
                                jobInstance.logger.log(LogType.changeAttribute, {
                                    id: activeAttribute.id,
                                    object_id: activeObjectState?.clientID,
                                    value,
                                });
                                attributes[activeAttribute.id] = value;
                                activeObjectState.attributes = attributes;
                                updateAnnotations([activeObjectState]);
                            }}
                        />)}
                    </Col>
                </Row>
                <Row type='flex' justify='space-around' className='cvat-text-annotation-sidebar-buttons'>
                    <Col span={8}>
                        <Button onClick={() => onAddTag(selectedLabelID)}>{t('Add text')}</Button>
                    </Col>
                    <Col span={8}>
                        <Button onClick={onChangeFrame}>{t('Skip frame')}</Button>
                    </Col>
                </Row>
            </Layout.Sider>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TextAnnotationSidebar);
