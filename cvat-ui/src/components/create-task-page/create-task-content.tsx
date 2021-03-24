// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd/lib/grid';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import Collapse from 'antd/lib/collapse';
import notification from 'antd/lib/notification';
import Text from 'antd/lib/typography/Text';

import ConnectedFileManager from 'containers/file-manager/file-manager';
import BasicConfigurationForm, { BaseConfiguration } from './basic-configuration-form';
import AdvancedConfigurationForm, { AdvancedConfiguration } from './advanced-configuration-form';
import LabelsEditor from '../labels-editor/labels-editor';
import { Files } from '../file-manager/file-manager';
import { withTranslation, WithTranslation  } from 'react-i18next';
import { HwDatasetInfo } from 'reducers/interfaces';
import { CombinedState } from 'reducers/interfaces';
import { getDatasetDataAsync } from 'actions/dataset-actions';
export interface CreateTaskData {
    basic: BaseConfiguration;
    advanced: AdvancedConfiguration;
    labels: any[];
    files: Files;
}

interface Props extends WithTranslation {
    onCreate: (data: CreateTaskData) => void;
    status: string;
    taskId: number | null;
    installedGit: boolean;
}

interface StateToProps {
    datasets: HwDatasetInfo[];
}

interface DispatchToProps {
    onFetchDsInfo: (dsId: number | undefined, success: () => void, failure: () => void) => HwDatasetInfo[];
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        onFetchDsInfo: (dsId: number | undefined, success: () => void, failure: () => void): HwDatasetInfo[] => dispatch(getDatasetDataAsync(dsId, success, failure)),
    };
}

function mapStateToProps(state: CombinedState, own: Props): StateToProps {
    const { datasets } = state.dataset;

    return {
        datasets,
    };
}

type State = CreateTaskData;

const defaultState = {
    basic: {
        name: '',
    },
    advanced: {
        lfs: false,
        useZipChunks: true,
        useCache: true,
    },
    labels: [],
    files: {
        local: [],
        share: [],
        remote: [],
        platform: [],
        dataset: [],
    },
};

class CreateTaskContent extends React.PureComponent<Props & RouteComponentProps<{dsId: string}> & StateToProps & DispatchToProps, State> {
    private basicConfigurationComponent: any;

    private advancedConfigurationComponent: any;

    private fileManagerContainer: any;

    public constructor(props: Props & RouteComponentProps<{dsId: string}> & StateToProps & DispatchToProps) {
        super(props);
        this.state = { ...defaultState };
    }

    public componentDidMount(): void {
        this.loadDatasetData()
        .then(() => {
            // this.setState({
            //     files: {
            //         dataset: datasets,
            //     },
            // });
            const { datasets } = this.props;
            // OCR默认label
            if (datasets && datasets.length > 0 && (datasets[0].annotType.startsWith('ocr'))) {
                this.setState({
                    labels: [
                        {
                            name: "text",
                            color: "#20cc1c",
                            attributes: [
                                {
                                    name: "value",
                                    input_type: "text",
                                    mutable: false,
                                    values: [
                                        ""
                                    ]
                                }
                            ]
                        }
                    ]
                });
            }
            console.log('load dataset success...')
        });
    }
    public componentDidUpdate(prevProps: Props): void {
        const { status, history, taskId, t } = this.props;

        if (status === 'CREATED' && prevProps.status !== 'CREATED') {
            const btn = <Button onClick={() => history.push(`/tasks/${taskId}`)}>{t('Open task')}</Button>;

            notification.info({
                message: t('The task has been created'),
                btn,
            });

            this.basicConfigurationComponent.resetFields();
            if (this.advancedConfigurationComponent) {
                this.advancedConfigurationComponent.resetFields();
            }

            this.fileManagerContainer.reset();

            this.setState({
                ...defaultState,
            });
        }
    }

    private loadDatasetData = (): Promise<void> =>
        new Promise<void>((resolve, reject): void => {
            const { onFetchDsInfo, match } = this.props;
            const dsId = +match.params.dsId;

            if (Number.isInteger(dsId)) {
                const success = (): void => resolve();
                const failure = (): void => reject();
                onFetchDsInfo(dsId, success, failure);
            }
        });

    private validateLabels = (): boolean => {
        const { labels } = this.state;
        return !!labels.length;
    };

    private validateFiles = (): boolean => {
        const files = this.fileManagerContainer.getFiles();
        this.setState({
            files,
        });
        const totalLen = Object.keys(files).reduce((acc, key) => acc + files[key].length, 0);

        return !!totalLen;
    };

    private handleSubmitBasicConfiguration = (values: BaseConfiguration): void => {
        this.setState({
            basic: { ...values },
        });
    };

    private handleSubmitAdvancedConfiguration = (values: AdvancedConfiguration): void => {
        this.setState({
            advanced: { ...values },
        });
    };

    private handleSubmitClick = (): void => {
        const { t } = this.props;
        if (!this.validateLabels()) {
            notification.error({
                message: t('Could not create a task'),
                description: t('A task must contain at least one label'),
            });
            return;
        }

        if (!this.validateFiles()) {
            notification.error({
                message: t('Could not create a task'),
                description: t('A task must contain at least one file'),
            });
            return;
        }

        this.basicConfigurationComponent
            .submit()
            .then(() => {
                if (this.advancedConfigurationComponent) {
                    return this.advancedConfigurationComponent.submit();
                }

                return new Promise((resolve): void => {
                    resolve();
                });
            })
            .then((): void => {
                const { onCreate } = this.props;
                onCreate(this.state);
            })
            .catch((error: Error): void => {
                notification.error({
                    message: t('Could not create a task'),
                    description: error.toString(),
                });
            });
    };

    private renderBasicBlock(): JSX.Element {
        const { datasets } = this.props;

        const ds = datasets.length > 0 ? datasets[0] : null;

        // 名称规则：需要将(多个)空格替换成_
        const name = ds ? `${ds.name}_${ds.annotType}_${ds.cvDatasetFormat}`.replace(/\s+_*/g, '_') : '';

        return (
            <Col span={24}>
                <BasicConfigurationForm
                    wrappedComponentRef={(component: any): void => {
                        this.basicConfigurationComponent = component;
                    }}
                    onSubmit={this.handleSubmitBasicConfiguration}
                    name={name}
                />
            </Col>
        );
    }

    private renderLabelsBlock(): JSX.Element {
        const { labels } = this.state;
        const { t } = this.props;

        return (
            <Col span={24}>
                <Text type='danger'>* </Text>
                <Text className='cvat-text-color'>{t('Labels:')}</Text>
                <LabelsEditor
                    labels={labels}
                    onSubmit={(newLabels): void => {
                        this.setState({
                            labels: newLabels,
                        });
                    }}
                />
            </Col>
        );
    }

    private renderFilesBlock(): JSX.Element {
        const { t } = this.props;
        return (
            <Col span={24}>
                <Text type='danger'>* </Text>
                <Text className='cvat-text-color'>{t('Select files:')}</Text>
                <ConnectedFileManager
                    ref={(container: any): void => {
                        this.fileManagerContainer = container;
                    }}
                    withRemote
                />
            </Col>
        );
    }

    private renderAdvancedBlock(): JSX.Element {
        const { installedGit, t } = this.props;
        return (
            <Col span={24}>
                <Collapse>
                    <Collapse.Panel key='1' header={<Text className='cvat-title'>{t('Advanced configuration')}</Text>}>
                        <AdvancedConfigurationForm
                            installedGit={installedGit}
                            wrappedComponentRef={(component: any): void => {
                                this.advancedConfigurationComponent = component;
                            }}
                            onSubmit={this.handleSubmitAdvancedConfiguration}
                        />
                    </Collapse.Panel>
                </Collapse>
            </Col>
        );
    }

    public render(): JSX.Element {
        const { status, t } = this.props;
        const loading = !!status && status !== 'CREATED' && status !== 'FAILED';

        return (
            <Row type='flex' justify='start' align='middle' className='cvat-create-task-content'>
                <Col span={24}>
                    <Text className='cvat-title'>{t('Basic configuration')}</Text>
                </Col>

                {this.renderBasicBlock()}
                {this.renderLabelsBlock()}
                {this.renderFilesBlock()}
                {this.renderAdvancedBlock()}

                <Col span={18}>{loading ? <Alert message={status} /> : null}</Col>
                <Col span={6}>
                    <Button loading={loading} disabled={loading} type='primary'onClick={this.handleSubmitClick}>
                        {t('Submit')}
                    </Button>
                </Col>
            </Row>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(CreateTaskContent)));
