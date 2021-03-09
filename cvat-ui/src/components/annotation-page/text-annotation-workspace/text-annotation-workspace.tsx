// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';

import CanvasWrapperContainer from 'containers/annotation-page/standard-workspace/canvas-wrapper';
import TextAnnotationSidebar from './text-annotation-sidebar/text-annotation-sidebar';

export default function TagAnnotationWorkspace(): JSX.Element {
    return (
        <Layout hasSider className='cvat-text-annotation-workspace'>
            <CanvasWrapperContainer />
            <TextAnnotationSidebar />
        </Layout>
    );
}
