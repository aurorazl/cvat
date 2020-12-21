import './styles.scss';
import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Layout from 'antd/lib/layout';
import Icon from 'antd/lib/icon';

import { SVGServeriusFooter } from 'icons';

export default function footer(): JSX.Element {
    return (
        <Layout.Footer className='cvat-footer'>
            <div className='cvat-left-footer'>
                <Icon className='cvat-serverius-footer' component={SVGServeriusFooter} />
            </div>
        </Layout.Footer>
    );
}