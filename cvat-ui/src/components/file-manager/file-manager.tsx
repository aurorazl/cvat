// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Tabs from 'antd/lib/tabs';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Text from 'antd/lib/typography/Text';
import Paragraph from 'antd/lib/typography/Paragraph';
import Upload, { RcFile } from 'antd/lib/upload';
import Empty from 'antd/lib/empty';
import Tree, { AntTreeNode, TreeNodeNormal } from 'antd/lib/tree/Tree';
import Select, { OptionProps } from 'antd/lib/select';

import consts from 'consts';

import { withTranslation, WithTranslation  } from 'react-i18next';
import { CombinedState, DatasetInfo } from 'reducers/interfaces';
import { connect } from 'react-redux';
import { HwDatasetInfo } from 'reducers/interfaces';
export interface Files {
    local: File[];
    share: string[];
    remote: string[];
    platform: string[];
    dataset: number[];
}

interface StateToProps {
    lang: string;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        lang: {lang}
    } = state;

    return {
        lang
    };
}

interface State {
    files: Files;
    expandedKeys: string[];
    active: 'local' | 'share' | 'remote' | 'platform'| 'dataset';
}

interface Props {
    withRemote: boolean;
    treeData: TreeNodeNormal[];
    platformData: DatasetInfo[];
    datasetData: HwDatasetInfo[];
    onLoadData: (key: string, success: () => void, failure: () => void) => void;
    onLoadPlatformData: (success: () => void, failure: () => void) => void;
    onChangeDataset(value: string): void;
    dsId: number | undefined;
}

const { Option } = Select;

class FileManager extends React.PureComponent<Props & WithTranslation, State & StateToProps> {
    public constructor(props: Props & WithTranslation) {
        super(props);

        this.state = {
            files: {
                local: [],
                share: [],
                remote: [],
                platform: [],
                dataset: [],
            },
            expandedKeys: [],
            active: 'dataset',
            lang: 'zh-CN',
        };

        // this.loadData('/');
        // this.loadPlatformData();
    }

    public getFiles(): Files {
        const { active, files } = this.state;

        return {
            local: active === 'local' ? files.local : [],
            share: active === 'share' ? files.share : [],
            remote: active === 'remote' ? files.remote : [],
            platform: active === 'platform' ? files.platform : [],
            dataset: active === 'dataset' ? files.dataset : [],
        };
    }

    private loadData = (key: string): Promise<void> =>
        new Promise<void>((resolve, reject): void => {
            const { onLoadData } = this.props;

            const success = (): void => resolve();
            const failure = (): void => reject();
            onLoadData(key, success, failure);
        });

    private loadPlatformData = (): Promise<void> =>
        new Promise<void>((resolve, reject): void => {
            const { onLoadPlatformData } = this.props;

            const success = (): void => resolve();
            const failure = (): void => reject();
            onLoadPlatformData(success, failure);
        });

    public reset(): void {
        this.setState({
            expandedKeys: [],
            active: 'dataset',
            files: {
                local: [],
                share: [],
                remote: [],
                platform: [],
                dataset: [],
            },
            lang: 'zh-CN',
        });
    }

    private renderLocalSelector(): JSX.Element {
        const { files } = this.state;
        const { t } = this.props;

        return (
            <Tabs.TabPane key='local' tab={t('My computer')}>
                <Upload.Dragger
                    multiple
                    listType='text'
                    fileList={files.local as any[]}
                    showUploadList={
                        files.local.length < 5 && {
                            showRemoveIcon: false,
                        }
                    }
                    beforeUpload={(_: RcFile, newLocalFiles: RcFile[]): boolean => {
                        this.setState({
                            files: {
                                ...files,
                                local: newLocalFiles,
                            },
                        });
                        return false;
                    }}
                >
                    <p className='ant-upload-drag-icon'>
                        <Icon type='inbox' />
                    </p>
                    <p className='ant-upload-text'>{t('Click or drag files to this area')}</p>
                    <p className='ant-upload-hint'>{t('Support for a bulk images or a single video')}</p>
                </Upload.Dragger>
                {files.local.length >= 5 && (
                    <>
                        <br />
                        <Text className='cvat-text-color'>{t('${files.local.length} files selected').replace('${files.local.length}', `${files.local.length}`)}</Text>
                    </>
                )}
            </Tabs.TabPane>
        );
    }

    private renderShareSelector(): JSX.Element {
        function renderTreeNodes(data: TreeNodeNormal[]): JSX.Element[] {
            // sort alphabetically
            data.sort((a: TreeNodeNormal, b: TreeNodeNormal): number => a.key.localeCompare(b.key));
            return data.map((item: TreeNodeNormal) => {
                if (item.children) {
                    return (
                        <Tree.TreeNode title={item.title} key={item.key} dataRef={item} isLeaf={item.isLeaf}>
                            {renderTreeNodes(item.children)}
                        </Tree.TreeNode>
                    );
                }

                return <Tree.TreeNode key={item.key} {...item} dataRef={item} />;
            });
        }

        const { SHARE_MOUNT_GUIDE_URL } = consts;
        const { treeData, t } = this.props;
        const { expandedKeys, files, lang } = this.state;

        return (
            <Tabs.TabPane key='share' tab={t('Connected file share')}>
                { treeData[0].children && treeData[0].children.length ? (
                    <Tree
                        className='cvat-share-tree'
                        checkable
                        showLine
                        checkStrictly={false}
                        expandedKeys={expandedKeys}
                        checkedKeys={files.share}
                        loadData={(node: AntTreeNode): Promise<void> => this.loadData(node.props.dataRef.key)}
                        onExpand={(newExpandedKeys: string[]): void => {
                            this.setState({
                                expandedKeys: newExpandedKeys,
                            });
                        }}
                        onCheck={(
                            checkedKeys:
                                | string[]
                                | {
                                    checked: string[];
                                    halfChecked: string[];
                                },
                            ): void => {
                                const keys = checkedKeys as string[];
                                this.setState({
                                    files: {
                                        ...files,
                                        share: keys,
                                    },
                                });
                            }}
                    >
                        { renderTreeNodes(treeData) }
                    </Tree>
                ) : (
                    <div className='cvat-empty-share-tree'>
                        <Empty />
                        <Paragraph className='cvat-text-color'>
                            { lang !== 'zh-CN' ?
                                (<>
                                    Please, be sure you had
                                    <Text strong>
                                        <a href={SHARE_MOUNT_GUIDE_URL}> mounted </a>
                                    </Text>
                                    share before you built ADAP and the shared storage contains files.
                                </>) :
                                (<>
                                    请确保在构建ADAP之前已
                                    <Text strong>
                                        <a href={SHARE_MOUNT_GUIDE_URL}> 加载 </a>
                                    </Text>
                                    了共享，并且共享存储中包含文件。
                                </>)
                            }
                        </Paragraph>
                    </div>
                )}
            </Tabs.TabPane>
        );
    }

    private renderRemoteSelector(): JSX.Element {
        const { files } = this.state;
        const { t } = this.props;

        return (
            <Tabs.TabPane key='remote' tab={t('Remote sources')}>
                <Input.TextArea
                    placeholder={t('Enter one URL per line')}
                    rows={6}
                    value={[...files.remote].join('\n')}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
                        this.setState({
                            files: {
                                ...files,
                                remote: event.target.value.split('\n'),
                            },
                        });
                    }}
                />
            </Tabs.TabPane>
        );
    }

    private renderPlatformSelector(): JSX.Element {
        const { files } = this.state;
        const { platformData, t } = this.props;

        return (
            <Tabs.TabPane key='platform' tab={t('AI Platform')}>
                <Select
                    disabled
                    showSearch
                    style={{ width: '100%' }}
                    placeholder={t('Select a dataset')}
                    filterOption={(input: string, option: React.ReactElement<OptionProps>) => {
                        const { children } = option.props;
                        if (typeof children === 'string') {
                            return children.toLowerCase().includes(input.toLowerCase());
                        }

                        return false;
                    }}
                    onChange={(value: string): void => {
                        this.setState({
                            files: {
                                ...files,
                                platform: [value],
                            },
                        });
                    }}
                >
                    {platformData.map((ds: any) => (
                        <Option key={ds.id} value={`${ds.path}`}>
                            {ds.name}
                        </Option>
                    ))}
                </Select>
            </Tabs.TabPane>
        );
    }

    private renderDatasetSelector(): JSX.Element {
        const { files } = this.state;
        const { datasetData, t, dsId } = this.props;
        const dsName = (datasetData && datasetData.length > 0) ? datasetData[0].name : '';

        return (
            <Tabs.TabPane key='dataset' tab={t('Dataset')}>
                <Input
                    value={dsName}
                    disabled
                />
                {datasetData && datasetData.length > 0 && !!(datasetData[0].itemCount) && (
                    <>
                        <br />
                        <Text className='cvat-text-color'>{t('${files.dataset.length} files selected').replace('${files.dataset.length}', `${datasetData[0].itemCount}`)}</Text>
                    </>
                )}
            </Tabs.TabPane>
        );
    }

    public render(): JSX.Element {
        const { withRemote } = this.props;
        const { active } = this.state;

        return (
            <>
                <Tabs
                    type='card'
                    activeKey={active}
                    tabBarGutter={5}
                    onChange={(activeKey: string): void =>
                        this.setState({
                            active: activeKey as any,
                        })
                    }
                >
                    {/* {this.renderLocalSelector()} */}
                    {/* {this.renderShareSelector()} */}
                    {/* {withRemote && this.renderRemoteSelector()} */}
                    {/* {this.renderPlatformSelector()} */}
                    {this.renderDatasetSelector()}
                </Tabs>
            </>
        );
    }

    public componentDidUpdate(prevProps, prevState): void {
        // if (this.state.files.dataset.length === 0) {
        if (prevState.files.dataset.length === 0) {
            const { files } = this.state;
            const { datasetData } = this.props;

            datasetData && datasetData[0] && this.setState({
                files: {
                    ...files,
                    dataset: [datasetData[0].id],
                },
            });
        }
    }
}

export default withTranslation(undefined, { withRef: true })(FileManager);
// export default connect(mapStateToProps)(withTranslation(undefined, { withRef: true })(FileManager));
