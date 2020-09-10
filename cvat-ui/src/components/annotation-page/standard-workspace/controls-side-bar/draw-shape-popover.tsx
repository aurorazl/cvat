// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Select, { OptionProps } from 'antd/lib/select';
import Button from 'antd/lib/button';
import InputNumber from 'antd/lib/input-number';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import Tooltip from 'antd/lib/tooltip';
import Text from 'antd/lib/typography/Text';

import { RectDrawingMethod, CuboidDrawingMethod } from 'cvat-canvas-wrapper';
import { ShapeType } from 'reducers/interfaces';
import { clamp } from 'utils/math';

import { useTranslation } from 'react-i18next';
import { transShapeType } from 'utils/lang-utils';

interface Props {
    shapeType: ShapeType;
    labels: any[];
    minimumPoints: number;
    rectDrawingMethod?: RectDrawingMethod;
    cuboidDrawingMethod?: CuboidDrawingMethod;
    numberOfPoints?: number;
    selectedLabeID: number;
    repeatShapeShortcut: string;
    onChangeLabel(value: string): void;
    onChangePoints(value: number | undefined): void;
    onChangeRectDrawingMethod(event: RadioChangeEvent): void;
    onChangeCuboidDrawingMethod(event: RadioChangeEvent): void;
    onDrawTrack(): void;
    onDrawShape(): void;
}

function DrawShapePopoverComponent(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        labels,
        shapeType,
        minimumPoints,
        selectedLabeID,
        numberOfPoints,
        rectDrawingMethod,
        cuboidDrawingMethod,
        repeatShapeShortcut,
        onDrawTrack,
        onDrawShape,
        onChangeLabel,
        onChangePoints,
        onChangeRectDrawingMethod,
        onChangeCuboidDrawingMethod,
    } = props;

    return (
        <div className='cvat-draw-shape-popover-content'>
            <Row type='flex' justify='start'>
                <Col>
                    <Text className='cvat-text-color' strong>{t('Draw new ${shapeType}').replace('${shapeType}', transShapeType(`${shapeType}`))}</Text>
                </Col>
            </Row>
            <Row type='flex' justify='start'>
                <Col>
                    <Text className='cvat-text-color'>{t('Label')}</Text>
                </Col>
            </Row>
            <Row type='flex' justify='center'>
                <Col span={24}>
                    <Select
                        showSearch
                        filterOption={(input: string, option: React.ReactElement<OptionProps>) => {
                            const { children } = option.props;
                            if (typeof (children) === 'string') {
                                return children.toLowerCase().includes(input.toLowerCase());
                            }

                            return false;
                        }}
                        value={`${selectedLabeID}`}
                        onChange={onChangeLabel}
                    >
                        {
                            labels.map((label: any) => (
                                <Select.Option
                                    key={label.id}
                                    value={`${label.id}`}
                                >
                                    {label.name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row>
            {
                shapeType === ShapeType.RECTANGLE && (
                    <>
                        <Row>
                            <Col>
                                <Text className='cvat-text-color'> {t('Drawing method')} </Text>
                            </Col>
                        </Row>
                        <Row type='flex' justify='space-around'>
                            <Col>
                                <Radio.Group
                                    style={{ display: 'flex' }}
                                    value={rectDrawingMethod}
                                    onChange={onChangeRectDrawingMethod}
                                >
                                    <Radio
                                        value={RectDrawingMethod.CLASSIC}
                                        style={{ width: 'auto' }}
                                    >
                                        {t('By 2 Points')}
                                    </Radio>
                                    <Radio
                                        value={RectDrawingMethod.EXTREME_POINTS}
                                        style={{ width: 'auto' }}
                                    >
                                        {t('By 4 Points')}
                                    </Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                    </>
                )
            }
            {
                shapeType === ShapeType.CUBOID && (
                    <>
                        <Row>
                            <Col>
                                <Text className='cvat-text-color'> {t('Drawing method')} </Text>
                            </Col>
                        </Row>
                        <Row type='flex' justify='space-around'>
                            <Col>
                                <Radio.Group
                                    style={{ display: 'flex' }}
                                    value={cuboidDrawingMethod}
                                    onChange={onChangeCuboidDrawingMethod}
                                >
                                    <Radio
                                        value={CuboidDrawingMethod.CLASSIC}
                                        style={{ width: 'auto' }}
                                    >
                                        {t('From rectangle')}
                                    </Radio>
                                    <Radio
                                        value={CuboidDrawingMethod.CORNER_POINTS}
                                        style={{ width: 'auto' }}
                                    >
                                        {t('By 4 Points')}
                                    </Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                    </>
                )
            }
            {
                shapeType !== ShapeType.RECTANGLE && shapeType !== ShapeType.CUBOID && (
                    <Row type='flex' justify='space-around' align='middle'>
                        <Col span={14}>
                            <Text className='cvat-text-color'> {t('Number of points:')} </Text>
                        </Col>
                        <Col span={10}>
                            <InputNumber
                                onChange={(value: number | undefined) => {
                                    if (typeof (value) === 'number') {
                                        onChangePoints(Math.floor(
                                            clamp(value, minimumPoints, Number.MAX_SAFE_INTEGER),
                                        ));
                                    } else if (!value) {
                                        onChangePoints(undefined);
                                    }
                                }}
                                className='cvat-draw-shape-popover-points-selector'
                                min={minimumPoints}
                                value={numberOfPoints}
                                step={1}
                            />
                        </Col>
                    </Row>
                )
            }
            <Row type='flex' justify='space-around'>
                <Col span={12}>
                    <Tooltip title={t('Press ${repeatShapeShortcut} to draw again').replace('${repeatShapeShortcut}', `${repeatShapeShortcut}`)} mouseLeaveDelay={0}>
                        <Button onClick={onDrawShape}>
                        {t('Shape')}
                        </Button>
                    </Tooltip>
                </Col>
                <Col span={12}>
                    <Tooltip title={t('Press ${repeatShapeShortcut} to draw again').replace('${repeatShapeShortcut}', `${repeatShapeShortcut}`)} mouseLeaveDelay={0}>
                        <Button onClick={onDrawTrack}>
                        {t('Track')}
                        </Button>
                    </Tooltip>
                </Col>
            </Row>
        </div>
    );
}

export default React.memo(DrawShapePopoverComponent);
