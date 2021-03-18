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
import { HwDatasetInfo } from 'reducers/interfaces';

interface OwnProps {
    ref: any;
    withRemote: boolean;
}

interface StateToProps {
    treeData: TreeNodeNormal[];
    platformData: DatasetInfo[];
    datasetData: HwDatasetInfo[],
    dsId: number | undefined;
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
    const { datasets: hwDatasets } = state.dataset;
    const dsId = hwDatasets.length > 0 ? hwDatasets[0].id : undefined;

    return {
        treeData: convert([root], ''),
        platformData: datasets || [],
        datasetData: hwDatasets || [],
        dsId,
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
        const { treeData, getTreeData, withRemote, getPlatformData, platformData, dsId, datasetData } = this.props;
        return (
            <FileManagerComponent
                treeData={treeData}
                onLoadData={getTreeData}
                platformData={platformData}
                onLoadPlatformData={getPlatformData}
                withRemote={withRemote}
                ref={(component: any): void => {
                    this.managerComponentRef = component;
                }}
                dsId={dsId}
                datasetData={datasetData}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(FileManagerContainer);
