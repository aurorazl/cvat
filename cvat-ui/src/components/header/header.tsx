// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Layout from 'antd/lib/layout';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Modal from 'antd/lib/modal';
import Text from 'antd/lib/typography/Text';

import getCore from 'cvat-core-wrapper';
import consts from 'consts';

import { CVATLogo, AccountIcon, ApulisLogo } from 'icons';
import ChangePasswordDialog from 'components/change-password-modal/change-password-modal';
import { switchSettingsDialog as switchSettingsDialogAction } from 'actions/settings-actions';
import { logoutAsync, authActions } from 'actions/auth-actions';
import { changeLang } from 'actions/lang-actions';
import { CombinedState } from 'reducers/interfaces';
import SettingsModal from './settings-modal/settings-modal';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import moment from 'moment';
import { useCookies } from 'react-cookie';

const core = getCore();

interface Tool {
    name: string;
    description: string;
    server: {
        host: string;
        version: string;
    };
    core: {
        version: string;
    };
    canvas: {
        version: string;
    };
    ui: {
        version: string;
    };
}

interface StateToProps {
    user: any;
    tool: Tool;
    switchSettingsShortcut: string;
    settingsDialogShown: boolean;
    changePasswordDialogShown: boolean;
    changePasswordFetching: boolean;
    logoutFetching: boolean;
    renderChangePasswordItem: boolean;
    isAnalyticsPluginActive: boolean;
    isModelsPluginActive: boolean;
    isGitPluginActive: boolean;
    lang: string;
}

interface DispatchToProps {
    onLogout: () => void;
    switchSettingsDialog: (show: boolean) => void;
    switchChangePasswordDialog: (show: boolean) => void;
    changeLang: (lang: string) => void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        auth: {
            user,
            fetching: logoutFetching,
            fetching: changePasswordFetching,
            showChangePasswordDialog: changePasswordDialogShown,
            allowChangePassword: renderChangePasswordItem,
        },
        plugins: { list },
        about: { server, packageVersion },
        shortcuts: { normalizedKeyMap },
        settings: { showDialog: settingsDialogShown },
        lang,
    } = state;

    return {
        user,
        tool: {
            name: server.name as string,
            description: server.description as string,
            server: {
                host: core.config.backendAPI.slice(0, -7),
                version: server.version as string,
            },
            canvas: {
                version: packageVersion.canvas,
            },
            core: {
                version: packageVersion.core,
            },
            ui: {
                version: packageVersion.ui,
            },
        },
        switchSettingsShortcut: normalizedKeyMap.SWITCH_SETTINGS,
        settingsDialogShown,
        changePasswordDialogShown,
        changePasswordFetching,
        logoutFetching,
        renderChangePasswordItem,
        isAnalyticsPluginActive: list.ANALYTICS,
        isModelsPluginActive: list.MODELS,
        isGitPluginActive: list.GIT_INTEGRATION,
        lang: lang.lang,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        onLogout: (): void => dispatch(logoutAsync()),
        switchSettingsDialog: (show: boolean): void => dispatch(switchSettingsDialogAction(show)),
        switchChangePasswordDialog: (show: boolean): void => dispatch(authActions.switchChangePasswordDialog(show)),
        changeLang: (lang: string): void => (dispatch(changeLang(lang))),
    };
}

type Props = StateToProps & DispatchToProps;

function HeaderContainer(props: Props): JSX.Element {
    const { t } = useTranslation();
    const {
        user,
        tool,
        logoutFetching,
        changePasswordFetching,
        settingsDialogShown,
        switchSettingsShortcut,
        onLogout,
        switchSettingsDialog,
        switchChangePasswordDialog,
        renderChangePasswordItem,
        isAnalyticsPluginActive,
        isModelsPluginActive,
        changeLang,
        lang,
    } = props;

    const { CHANGELOG_URL, LICENSE_URL, GITTER_URL, FORUM_URL, GITHUB_URL } = consts;

    const history = useHistory();

    const [cookies, setCookie] = useCookies(['language']);

    function showAboutModal(): void {
        Modal.info({
            title: `${tool.name}`,
            content: (
                <div>
                    <p>{`${tool.description}`}</p>
                    <p>
                        <Text strong>{t('Server version:')}</Text>
                        <Text type='secondary'>{` ${tool.server.version}`}</Text>
                    </p>
                    <p>
                        <Text strong>{t('Core version:')}</Text>
                        <Text type='secondary'>{` ${tool.core.version}`}</Text>
                    </p>
                    <p>
                        <Text strong>{t('Canvas version:')}</Text>
                        <Text type='secondary'>{` ${tool.canvas.version}`}</Text>
                    </p>
                    <p>
                        <Text strong>{t('UI version:')}</Text>
                        <Text type='secondary'>{` ${tool.ui.version}`}</Text>
                    </p>
                    <Row type='flex' justify='space-around'>
                        <Col>
                            <a href={CHANGELOG_URL} target='_blank' rel='noopener noreferrer'>
                                    {t('What\'s new?')}
                            </a>
                        </Col>
                        <Col>
                            <a href={LICENSE_URL} target='_blank' rel='noopener noreferrer'>
                                    {t('License')}
                            </a>
                        </Col>
                        <Col>
                            <a href={GITTER_URL} target='_blank' rel='noopener noreferrer'>
                                    {t('Need help?')}
                            </a>
                        </Col>
                        <Col>
                            <a href={FORUM_URL} target='_blank' rel='noopener noreferrer'>
                                    {t('Forum on Intel Developer Zone')}
                            </a>
                        </Col>
                    </Row>
                </div>
            ),
            width: 800,
            okButtonProps: {
                style: {
                    width: '100px',
                },
            },
        });
    }

    const menu = (
        <Menu className='cvat-header-menu' mode='vertical'>
            {/* {user.isStaff && (
                <Menu.Item
                    onClick={(): void => {
                        // false positive
                        // eslint-disable-next-line
                        window.open(`${tool.server.host}/admin`, '_blank');
                    }}
                >
                    <Icon type='control' />
                    {t('Admin page')}
                </Menu.Item>
            )} */}

            <Menu.Item title={t('Press ${switchSettingsShortcut} to switch').replace('${switchSettingsShortcut}', `${switchSettingsShortcut}`)} onClick={() => switchSettingsDialog(true)}>
                <Icon type='setting' />
                {t('Settings')}
            </Menu.Item>
            {/* <Menu.Item onClick={showAboutModal}>
                <Icon type='info-circle' />
                {t('About')}
            </Menu.Item>
            {/* {renderChangePasswordItem && (
                <Menu.Item onClick={(): void => switchChangePasswordDialog(true)} disabled={changePasswordFetching}>
                    {changePasswordFetching ? <Icon type='loading' /> : <Icon type='edit' />}
                    {t('Change password')}
                </Menu.Item>
            )} */}

            <Menu.Item onClick={onLogout} disabled={logoutFetching}>
                {logoutFetching ? <Icon type='loading' /> : <Icon type='logout' />}
                {t('Logout')}
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout.Header className='cvat-header'>
            <div className='cvat-left-header'>
                {/* <Icon className='cvat-logo-icon' component={ApulisLogo} /> */}
                <h1 className='cvat-logo-h1'>{t('Apulis Data Annotation Platform')}</h1>

                {/* <Button
                    className='cvat-header-button'
                    type='link'
                    value='tasks'
                    href='/tasks?page=1'
                    onClick={(event: React.MouseEvent): void => {
                        event.preventDefault();
                        history.push('/tasks?page=1');
                    }}
                    style={{marginLeft: 20}}
                >
                    {t('Tasks')}
                </Button> */}

                {/* {isModelsPluginActive && (
                    <Button
                        className='cvat-header-button'
                        type='link'
                        value='models'
                        href='/models'
                        onClick={(event: React.MouseEvent): void => {
                            event.preventDefault();
                            history.push('/models');
                        }}
                    >
                        {t('Models')}
                    </Button>
                )} */}
                {/* {isAnalyticsPluginActive && (
                    <Button
                        className='cvat-header-button'
                        type='link'
                        href={`${tool.server.host}/analytics/app/kibana`}
                        onClick={(event: React.MouseEvent): void => {
                            event.preventDefault();
                            // false positive
                            // eslint-disable-next-line
                            window.open(`${tool.server.host}/analytics/app/kibana`, '_blank');
                        }}
                    >
                        {t('Analytics')}
                    </Button>
                )} */}
            </div>
            <div className='cvat-right-header'>
                {/* <Button
                    className='cvat-header-button'
                    type='link'
                    href={GITHUB_URL}
                    onClick={(event: React.MouseEvent): void => {
                        event.preventDefault();
                        // false positive
                        // eslint-disable-next-line security/detect-non-literal-fs-filename
                        window.open(GITHUB_URL, '_blank');
                    }}
                >
                    <Icon type='github' />
                    <Text className='cvat-text-color'>GitHub</Text>
                </Button> */}
                <Button
                    className='cvat-header-button'
                    size='small'
                    onClick={
                        ()=>{
                            const selected: string = lang === 'en-US' ? 'zh-CN' : 'en-US';
                            changeLang(selected);
                            window.localStorage.setItem('language', selected);
                            i18n.changeLanguage(selected);

                            if (moment?.locale) {
                                moment.locale(selected.toLowerCase());
                            }

                            document.title = t('Apulis Data Annotation Platform') as string;

                            setCookie('language', selected, { path: '/' });
                        }
                    }
                >
                    {/* <Text className='cvat-text-color'>{lang === 'en-US' ? '中文' : 'English'}</Text> */}
                    <Text className='cvat-text-color'>{(localStorage.getItem('language') || navigator.language) === 'en-US' ? '中文' : 'English'}</Text>
                </Button>
                <Button
                    className='cvat-header-button'
                    type='link'
                    href={`${tool.server.host}/documentation/user_guide.html?language=${lang}`}
                    onClick={(event: React.MouseEvent): void => {
                        event.preventDefault();
                        // false positive
                        // eslint-disable-next-line
                        window.open(`${tool.server.host}/documentation/user_guide.html?language=${lang}`, '_blank');
                    }}
                >
                    <Icon type='question-circle' />
                    {t('Help')}
                </Button>
                <Dropdown overlay={menu} className='cvat-header-menu-dropdown'>
                    <span>
                        <Icon className='cvat-header-account-icon' component={AccountIcon} style={{color:'#fff'}}/>
                        <Text strong style={{color:'#fff'}}>
                            {user.username.length > 14 ? `${user.username.slice(0, 10)} ...` : user.username}
                        </Text>
                        <Icon className='cvat-header-menu-icon' type='caret-down' />
                    </span>
                </Dropdown>
            </div>
            <SettingsModal visible={settingsDialogShown} onClose={() => switchSettingsDialog(false)} />
            {renderChangePasswordItem && <ChangePasswordDialog onClose={() => switchChangePasswordDialog(false)} />}
        </Layout.Header>
    );
}

function propsAreTheSame(prevProps: Props, nextProps: Props): boolean {
    let equal = true;
    for (const prop in nextProps) {
        if (prop in prevProps && (prevProps as any)[prop] !== (nextProps as any)[prop]) {
            if (prop !== 'tool') {
                equal = false;
            }
        }
    }

    return equal;
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(HeaderContainer, propsAreTheSame));
