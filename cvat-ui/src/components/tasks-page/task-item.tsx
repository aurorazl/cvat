// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Dropdown from 'antd/lib/dropdown';
import Progress from 'antd/lib/progress';
import moment from 'moment';

import ActionsMenuContainer from 'containers/actions-menu/actions-menu';
import { ActiveInference } from 'reducers/interfaces';
import { MenuIcon } from 'icons';

import { withTranslation, WithTranslation } from 'react-i18next';
import { transMoment } from 'utils/lang-utils';
import AutomaticAnnotationProgress from './automatic-annotation-progress';

// import 'theme/customize.less';

export interface TaskItemProps extends WithTranslation {
    taskInstance: any;
    previewImage: string;
    deleted: boolean;
    hidden: boolean;
    activeInference: ActiveInference | null;
    cancelAutoAnnotation(): void;
}

class TaskItemComponent extends React.PureComponent<TaskItemProps & RouteComponentProps> {
    private renderPreview(): JSX.Element {
        const { previewImage, t } = this.props;
        return (
            <Col span={4}>
                <div className='cvat-task-item-preview-wrapper'>
                    <img alt={t('Preview')} className='cvat-task-item-preview' src={previewImage} />
                </div>
            </Col>
        );
    }

    private renderDescription(): JSX.Element {
        // Task info
        const { taskInstance, t } = this.props;
        const { id } = taskInstance;
        const owner = taskInstance.owner ? taskInstance.owner.username : null;
        const updated = moment(taskInstance.updatedDate).fromNow();
        const created = moment(taskInstance.createdDate);

        // Get and truncate a task name
        const name = `${taskInstance.name.substring(0, 70)}${taskInstance.name.length > 70 ? '...' : ''}`;

        return (
            <Col span={10} className='cvat-task-item-description'>
                <Text strong type='secondary'>{`#${id}: `}</Text>
                <Text strong className='cvat-text-color'>
                    {name}
                </Text>
                <br />
                {owner && (
                    <>
                        <Text type='secondary'>
                            {owner ? t('Created by ${owner} on ${created}', {owner: owner, created: transMoment(created),}) : t('Created on ${created}', { created: transMoment(created) })}
                        </Text>
                        <br />
                    </>
                )}
                {/* eslint-disable-next-line */}
                <Text type='secondary'>{t('Last updated ${updated}').replace('${updated}', `${updated}`)}</Text>
            </Col>
        );
    }

    private renderProgress(): JSX.Element {
        const { taskInstance, activeInference, cancelAutoAnnotation, t } = this.props;
        // Count number of jobs and performed jobs
        const numOfJobs = taskInstance.jobs.length;
        const numOfCompleted = taskInstance.jobs.filter((job: any): boolean => job.status === 'completed').length;

        // Progress appearence depends on number of jobs
        let progressColor = null;
        let progressText = null;
        if (numOfCompleted && numOfCompleted === numOfJobs) {
            progressColor = 'cvat-task-completed-progress';
            progressText = (
                <Text strong className={progressColor}>
                    {t('Completed')}
                </Text>
            );
        } else if (numOfCompleted) {
            progressColor = 'cvat-task-progress-progress';
            progressText = (
                <Text strong className={progressColor}>
                    {t('In Progress')}
                </Text>
            );
        } else {
            progressColor = 'cvat-task-pending-progress';
            progressText = (
                <Text strong className={progressColor}>
                    {t('Pending')}
                </Text>
            );
        }

        const jobsProgress = numOfCompleted / numOfJobs;

        return (
            <Col span={6}>
                <Row type='flex' justify='space-between' align='top'>
                    <Col>
                        <svg height='8' width='8' className={progressColor}>
                            <circle cx='4' cy='4' r='4' strokeWidth='0' />
                        </svg>
                        {progressText}
                    </Col>
                    <Col>
                        <Text type='secondary'>{t('${numOfCompleted} of ${numOfJobs} jobs').replace('${numOfCompleted}', `${numOfCompleted}`).replace('${numOfJobs}', `${numOfJobs}`)}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Progress
                            className={`${progressColor} cvat-task-progress`}
                            percent={jobsProgress * 100}
                            strokeColor='#1890FF'
                            showInfo={false}
                            strokeWidth={5}
                            size='small'
                        />
                    </Col>
                </Row>
                <AutomaticAnnotationProgress
                    activeInference={activeInference}
                    cancelAutoAnnotation={cancelAutoAnnotation}
                />
            </Col>
        );
    }

    private renderNavigation(): JSX.Element {
        const { taskInstance, history, t } = this.props;
        const { id } = taskInstance;

        return (
            <Col span={4}>
                <Row type='flex' justify='end'>
                    <Col>
                        <Button
                            className='cvat-item-open-task-button'
                            type='primary'
                            size='large'
                            href={`/tasks/${id}`}
                            onClick={(e: React.MouseEvent): void => {
                                e.preventDefault();
                                history.push(`/tasks/${id}`);
                            }}
                        >
                            {t('Open')}
                        </Button>
                    </Col>
                </Row>
                <Row type='flex' justify='end'>
                    <Col className='cvat-item-open-task-actions'>
                        <Text className='cvat-text-color'>{t('Actions')}</Text>
                        <Dropdown overlay={<ActionsMenuContainer taskInstance={taskInstance} />}>
                            <Icon className='cvat-menu-icon' component={MenuIcon} />
                        </Dropdown>
                    </Col>
                </Row>
            </Col>
        );
    }

    public render(): JSX.Element {
        const { deleted, hidden } = this.props;
        const style = {};
        if (deleted) {
            (style as any).pointerEvents = 'none';
            // (style as any).opacity = 0.5;
            (style as any).display = 'none';
        }

        if (hidden) {
            (style as any).display = 'none';
        }

        return (
            <Row className='cvat-tasks-list-item' type='flex' justify='center' align='top' style={{ ...style }}>
                {this.renderPreview()}
                {this.renderDescription()}
                {this.renderProgress()}
                {this.renderNavigation()}
            </Row>
        );
    }
}

export default withRouter(withTranslation()(TaskItemComponent));
