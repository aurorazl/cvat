// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Icon from 'antd/lib/icon';

interface Props {
    helpLink: string;
    styles?: any;
}

export default function HelpLinkComponent(props: Props): JSX.Element {
    const { helpLink, styles } = props;

    return (
        <div className= "cvat-help-link" style={{...styles}} onClick={(): void => {
            window.open(`${helpLink}`, '_blank');
        }}>
            <Icon type='question-circle' />
        </div>
    );
}