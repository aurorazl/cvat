// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Tooltip from 'antd/lib/tooltip';

import { BackgroundIcon, ForegroundIcon, ResetPerspectiveIcon, ColorizeIcon } from 'icons';
import { ObjectType, ShapeType, ColorBy } from 'reducers/interfaces';
import ColorPicker from './color-picker';
import { useTranslation } from 'react-i18next';

interface Props {
    serverID: number | undefined;
    locked: boolean;
    shapeType: ShapeType;
    objectType: ObjectType;
    color: string;
    colorBy: ColorBy;
    colorPickerVisible: boolean;
    changeColorShortcut: string;
    copyShortcut: string;
    pasteShortcut: string;
    propagateShortcut: string;
    toBackgroundShortcut: string;
    toForegroundShortcut: string;
    removeShortcut: string;
    changeColor(value: string): void;
    copy(): void;
    remove(): void;
    propagate(): void;
    createURL(): void;
    switchOrientation(): void;
    toBackground(): void;
    toForeground(): void;
    resetCuboidPerspective(): void;
    changeColorPickerVisible(visible: boolean): void;
    activateTracking(): void;
}

export default function ItemMenu(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        serverID,
        locked,
        shapeType,
        objectType,
        color,
        colorBy,
        colorPickerVisible,
        changeColorShortcut,
        copyShortcut,
        pasteShortcut,
        propagateShortcut,
        toBackgroundShortcut,
        toForegroundShortcut,
        removeShortcut,
        changeColor,
        copy,
        remove,
        propagate,
        createURL,
        switchOrientation,
        toBackground,
        toForeground,
        resetCuboidPerspective,
        changeColorPickerVisible,
        activateTracking,
    } = props;

    return (
        <Menu className='cvat-object-item-menu'>
            <Menu.Item>
                <Button disabled={serverID === undefined} type='link' icon='link' onClick={createURL}>
                {t('Create object URL')}
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Tooltip title={t('${copyShortcut} and ${pasteShortcut}', {copyShortcut: `${copyShortcut}`, pasteShortcut: `${pasteShortcut}`})} mouseLeaveDelay={0}>
                    <Button type='link' icon='copy' onClick={copy}>
                    {t('Make a copy')}
                    </Button>
                </Tooltip>
            </Menu.Item>
            <Menu.Item>
                <Tooltip title={`${propagateShortcut}`} mouseLeaveDelay={0}>
                    <Button type='link' icon='block' onClick={propagate}>
                    {t('Propagate')}
                    </Button>
                </Tooltip>
            </Menu.Item>
            {objectType === ObjectType.TRACK && shapeType === ShapeType.RECTANGLE && (
                <Menu.Item>
                    <Tooltip title={t('Run tracking with the active tracker')} mouseLeaveDelay={0}>
                        <Button type='link' onClick={activateTracking}>
                            <Icon type='gateway' />
                            {t('Track')}
                        </Button>
                    </Tooltip>
                </Menu.Item>
            )}
            {[ShapeType.POLYGON, ShapeType.POLYLINE, ShapeType.CUBOID].includes(shapeType) && (
                <Menu.Item>
                    <Button type='link' icon='retweet' onClick={switchOrientation}>
                    {t('Switch orientation')}
                    </Button>
                </Menu.Item>
            )}
            {shapeType === ShapeType.CUBOID && (
                <Menu.Item>
                    <Button type='link' onClick={resetCuboidPerspective}>
                        <Icon component={ResetPerspectiveIcon} />
                        {t('Reset perspective')}
                    </Button>
                </Menu.Item>
            )}
            {objectType !== ObjectType.TAG && (
                <Menu.Item>
                    <Tooltip title={`${toBackgroundShortcut}`} mouseLeaveDelay={0}>
                        <Button type='link' onClick={toBackground}>
                            <Icon component={BackgroundIcon} />
                            {t('To background')}
                        </Button>
                    </Tooltip>
                </Menu.Item>
            )}
            {objectType !== ObjectType.TAG && (
                <Menu.Item>
                    <Tooltip title={`${toForegroundShortcut}`} mouseLeaveDelay={0}>
                        <Button type='link' onClick={toForeground}>
                            <Icon component={ForegroundIcon} />
                            {t('To foreground')}
                        </Button>
                    </Tooltip>
                </Menu.Item>
            )}
            {[ColorBy.INSTANCE, ColorBy.GROUP].includes(colorBy) && (
                <Menu.Item>
                    <ColorPicker
                        value={color}
                        onChange={changeColor}
                        visible={colorPickerVisible}
                        onVisibleChange={changeColorPickerVisible}
                        resetVisible={false}
                    >
                        <Tooltip title={`${changeColorShortcut}`} mouseLeaveDelay={0}>
                            <Button type='link'>
                                <Icon component={ColorizeIcon} />
                                {t('Change ${colorBy.toLowerCase()} color').replace('${colorBy.toLowerCase()}', `${colorBy.toLowerCase()}`)}
                            </Button>
                        </Tooltip>
                    </ColorPicker>
                </Menu.Item>
            )}
            <Menu.Item>
                <Tooltip title={`${removeShortcut}`} mouseLeaveDelay={0}>
                    <Button
                        type='link'
                        icon='delete'
                        onClick={(): void => {
                            if (locked) {
                                Modal.confirm({
                                    title: t('Object is locked'),
                                    content: t('Are you sure you want to remove it?'),
                                    onOk() {
                                        remove();
                                    },
                                });
                            } else {
                                remove();
                            }
                        }}
                    >
                        {t('Remove')}
                    </Button>
                </Tooltip>
            </Menu.Item>
        </Menu>
    );
}
