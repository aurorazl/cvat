// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { connect } from 'react-redux';

import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import FileManagerComponent, { Files } from 'components/file-manager/file-manager';

import { loadShareDataAsync } from 'actions/share-actions';
import { ShareItem, CombinedState, DatasetInfo } from 'reducers/interfaces';
import { loadPlatformDataAsync } from 'actions/platform-actions';

interface OwnProps {
    ref: any;
    withRemote: boolean;
}

interface StateToProps {
    treeData: TreeNodeNormal[];
    platformData: DatasetInfo[];
}

interface DispatchToProps {
    getTreeData(key: string, success: () => void, failure: () => void): void;
    getPlatformData(success: () => void, failure: () => void): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    function convert(items: ShareItem[], path?: string): TreeNodeNormal[] {
        return items.map(
            (item): TreeNodeNormal => {
                const isLeaf = item.type !== 'DIR';
                const key = `${path}${item.name}${isLeaf ? '' : '/'}`;
                return {
                    key,
                    isLeaf,
                    title: item.name || 'root',
                    children: convert(item.children, key),
                };
            },
        );
    }

    const { root } = state.share;
    const { datasets } = state.platform;

    return {
        treeData: convert([root], ''),
        platformData: datasets || [],
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        getTreeData: (key: string, success: () => void, failure: () => void): void => {
            dispatch(loadShareDataAsync(key, success, failure));
        },
        getPlatformData: (success: () => void, failure: () => void): void => {
            dispatch(loadPlatformDataAsync(success, failure));
        },
    };
}

type Props = StateToProps & DispatchToProps & OwnProps;

export class FileManagerContainer extends React.PureComponent<Props> {
    private managerComponentRef: any;

    public getFiles(): Files {
        return this.managerComponentRef.getFiles();
    }

    public reset(): Files {
        return this.managerComponentRef.reset();
    }

    public render(): JSX.Element {
        const { treeData, getTreeData, withRemote, getPlatformData, platformData } = this.props;
        return (
            <FileManagerComponent
                treeData={treeData}
                onLoadData={getTreeData}
                platformData={platformData}
                onLoadPlatformData={getPlatformData}
                withRemote={withRemote}
                ref={(component): void => {
                    this.managerComponentRef = component;
                }}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(FileManagerContainer);
