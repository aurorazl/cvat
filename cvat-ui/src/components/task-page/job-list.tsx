// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd/lib/grid';
import Icon from 'antd/lib/icon';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import Text from 'antd/lib/typography/Text';
import moment from 'moment';
import copy from 'copy-to-clipboard';

import getCore from 'cvat-core-wrapper';
import UserSelector from './user-selector';

import { useTranslation } from 'react-i18next';
import { transMoment } from 'utils/lang-utils';

const core = getCore();

const baseURL = core.config.backendAPI.slice(0, -7);


interface Props {
    taskInstance: any;
    registeredUsers: any[];
    onJobUpdate(jobInstance: any): void;
}

function JobListComponent(props: Props & RouteComponentProps): JSX.Element {
    const { t } = useTranslation();
    const {
        taskInstance,
        registeredUsers,
        onJobUpdate,
        history: { push },
    } = props;

    const { jobs, id: taskId } = taskInstance;
    const columns = [
        {
        title: t('Job'),
        dataIndex: 'job',
        key: 'job',
        render: (id: number): JSX.Element => (
            <div>
                <Button
                    type='link'
                    onClick={(e: React.MouseEvent): void => {
                        e.preventDefault();
                        push(`/tasks/${taskId}/jobs/${id}`);
                    }}
                    href={`/tasks/${taskId}/jobs/${id}`}
                >
                    {`Job #${id}`}
                </Button>
            </div>
        ),
    },
    {
        title: t('Frames'),
        dataIndex: 'frames',
        key: 'frames',
        className: 'cvat-text-color',
    },
    {
        title: t('Status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: string): JSX.Element => {
            let progressColor = null;
            if (status === 'completed') {
                progressColor = 'cvat-job-completed-color';
            } else if (status === 'validation') {
                progressColor = 'cvat-job-validation-color';
            } else {
                progressColor = 'cvat-job-annotation-color';
            }

            return (
                <Text strong className={progressColor}>
                    { t(status) }
                </Text>
            );
        },
    },
    {
        title: t('Labeled'),
        dataIndex: 'labeled',
        key: 'labeled',
        className: 'cvat-text-color',
    },
    {
        title: t('Unlabeled'),
        dataIndex: 'unlabeled',
        key: 'unlabeled',
        className: 'cvat-text-color',
    },
    {
        title: t('Started on'),
        dataIndex: 'started',
        key: 'started',
        className: 'cvat-text-color',
    },
    {
        title: t('Duration'),
        dataIndex: 'duration',
        key: 'duration',
        className: 'cvat-text-color',
    },
    {
        title: t('Assignee'),
        dataIndex: 'assignee',
        key: 'assignee',
        render: (jobInstance: any): JSX.Element => {
            const assignee = jobInstance.assignee ? jobInstance.assignee.username : null;

            return (
                <UserSelector
                    users={registeredUsers}
                    value={assignee}
                    onChange={(value: string): void => {
                        let [userInstance] = [...registeredUsers].filter((user: any) => user.username === value);

                        if (userInstance === undefined) {
                            userInstance = null;
                        }

                        // eslint-disable-next-line
                        jobInstance.assignee = userInstance;
                        onJobUpdate(jobInstance);
                    }}
                />
            );
        },
    },
    ];

    let completed = 0;
    const data = jobs.reduce((acc: any[], job: any) => {
        if (job.status === 'completed') {
            completed++;
        }

        const created = moment(props.taskInstance.createdDate);

        acc.push({
            key: job.id,
            job: job.id,
            frames: `${job.startFrame}-${job.stopFrame}`,
            status: `${job.status}`,
            labeled: job.labeled ?? '',
            unlabeled: job.unlabeled ?? '',
            started: transMoment(created),
            duration: `${moment.duration(moment(moment.now()).diff(created)).humanize()}`,
            assignee: job,
        });

        return acc;
    }, []);

    return (
        <div className='cvat-task-job-list'>
            <Row type='flex' justify='space-between' align='middle'>
                <Col>
                    <Text className='cvat-text-color cvat-jobs-header'> {t('Jobs')} </Text>
                    <Tooltip trigger='click' title={t('Copied to clipboard!')} mouseLeaveDelay={0}>
                        <Button
                            type='link'
                            onClick={(): void => {
                                let serialized = '';
                                const [latestJob] = [...taskInstance.jobs].reverse();
                                for (const job of taskInstance.jobs) {
                                    serialized += `Job #${job.id}`.padEnd(`${latestJob.id}`.length + 6, ' ');
                                    serialized += `: ${baseURL}/?id=${job.id}`.padEnd(
                                        `${latestJob.id}`.length + baseURL.length + 8,
                                        ' ',
                                    );
                                    serialized += `: [${job.startFrame}-${job.stopFrame}]`.padEnd(
                                        `${latestJob.startFrame}${latestJob.stopFrame}`.length + 5,
                                        ' ',
                                    );

                                    if (job.assignee) {
                                        serialized += `\t assigned to: ${job.assignee.username}`;
                                    }
                                    serialized += '\n';
                                }
                                copy(serialized);
                            }}
                        >
                            <Icon type='copy' theme='twoTone' />
                            {t('Copy')}
                        </Button>
                    </Tooltip>
                </Col>
                <Col>
                    <Text className='cvat-text-color'>{t('${completed} of ${data.length} jobs', { completed: `${completed}`, dataLength: `${data.length}`})}</Text>
                </Col>
            </Row>
            <Table className='cvat-task-jobs-table' columns={columns} dataSource={data} size='small' />
        </div>
    );
}

export default withRouter(JobListComponent);
