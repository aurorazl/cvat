// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import Drawer from 'antd/lib/drawer';
import Paragraph from 'antd/lib/typography/Paragraph';
import Button from 'antd/lib/button/button';

import { isPublic } from 'utils/enviroment';
import { useTranslation } from 'react-i18next';

function CookieDrawer(): JSX.Element {
    const { t } = useTranslation();
    const [drawerVisible, setDrawerVisible] = useState(false);

    useEffect(() => {
        const cookiePolicyAccepted = localStorage.getItem('cookiePolicyAccepted');
        if (cookiePolicyAccepted === null && isPublic()) {
            setDrawerVisible(true);
        }
    }, []);

    const onClose = (): void => {
        localStorage.setItem('cookiePolicyAccepted', 'true');
        setDrawerVisible(false);
    };

    return (
        <Drawer
            title={t('About Cookies on this site:')}
            placement='bottom'
            closable={false}
            visible={drawerVisible}
            height={200}
            destroyOnClose
        >
            <Paragraph>
                This site uses cookies for functionality, analytics, and advertising purposes as described in our Cookie
                and Similar Technologies Notice. To see what cookies we serve and set your preferences, please visit our
                <a href='https://www.intel.com/cookies'> Cookie Consent Tool</a>. By continuing to use our website, you
                agree to our use of cookies.
            </Paragraph>
            <Button onClick={onClose} size='large' type='primary'>
            {t('Accept')}
            </Button>
        </Drawer>
    );
}

export default CookieDrawer;
