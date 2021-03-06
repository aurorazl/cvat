// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Col } from 'antd/lib/grid';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import Timeline from 'antd/lib/timeline';
import Dropdown from 'antd/lib/dropdown';

import AnnotationMenuContainer from 'containers/annotation-page/top-bar/annotation-menu';
import { MainMenuIcon, SaveIcon, UndoIcon, RedoIcon } from 'icons';
import { useTranslation } from 'react-i18next';

interface Props {
    saving: boolean;
    savingStatuses: string[];
    undoAction?: string;
    redoAction?: string;
    saveShortcut: string;
    undoShortcut: string;
    redoShortcut: string;
    onSaveAnnotation(): void;
    onUndoClick(): void;
    onRedoClick(): void;
}

function LeftGroup(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        saving,
        savingStatuses,
        undoAction,
        redoAction,
        saveShortcut,
        undoShortcut,
        redoShortcut,
        onSaveAnnotation,
        onUndoClick,
        onRedoClick,
    } = props;

    return (
        <Col className='cvat-annotation-header-left-group'>
            <Dropdown overlay={<AnnotationMenuContainer />}>
                <Button type='link' className='cvat-annotation-header-button'>
                    <Icon component={MainMenuIcon} />
                    {t('Menu')}
                </Button>
            </Dropdown>
            <Button
                title={t('Save current changes ${saveShortcut}').replace('${saveShortcut}', `${saveShortcut}`)}
                onClick={saving ? undefined : onSaveAnnotation}
                type='link'
                className={saving ? 'cvat-annotation-disabled-header-button' : 'cvat-annotation-header-button'}
            >
                <Icon component={SaveIcon} />
                { saving ? t('Saving...') : t('Save') }
                <Modal title={t('Saving changes on the server')} visible={saving} footer={[]} closable={false}>
                    <Timeline pending={savingStatuses[savingStatuses.length - 1] || t('Pending..')}>
                        {savingStatuses.slice(0, -1).map((status: string, id: number) => (
                            <Timeline.Item key={id}>{status}</Timeline.Item>
                        ))}
                    </Timeline>
                </Modal>
            </Button>
            <Button
                title={t('Undo: ${undoAction} ${undoShortcut}', {undoAction: `${undoAction}`, undoShortcut: `${undoShortcut}`})}
                disabled={!undoAction}
                style={{ pointerEvents: undoAction ? 'initial' : 'none', opacity: undoAction ? 1 : 0.5 }}
                type='link'
                className='cvat-annotation-header-button'
                onClick={onUndoClick}
            >
                <Icon component={UndoIcon} />
                <span>{t('Undo')}</span>
            </Button>
            <Button
                title={t('Redo: ${redoAction} ${redoShortcut}', {redoAction: `${redoAction}`, redoShortcut: `${redoShortcut}`})}
                disabled={!redoAction}
                style={{ pointerEvents: redoAction ? 'initial' : 'none', opacity: redoAction ? 1 : 0.5 }}
                type='link'
                className='cvat-annotation-header-button'
                onClick={onRedoClick}
            >
                <Icon component={RedoIcon} />
                {t('Redo')}
            </Button>
        </Col>
    );
}

export default React.memo(LeftGroup);
