import { Meteor } from 'meteor/meteor';
import React, { Fragment, useEffect, useState } from 'react';
import List from 'antd/lib/list';
import Space from 'antd/lib/space';
import Tag from 'antd/lib/tag';
import Table from 'antd/lib/table';

import { useOpinions } from '../client/trackers';
import { MediaQuery, useMediaQueries } from '../client/mediaQueries';

const lower = a => {
    if (!a) return '';

    return a.toLowerCase();
}

export const ListOpinions = () => {
    const [ opinions, isLoading ] = useOpinions();

    const { isPhone, isTablet, isDesktop } = useMediaQueries();

    let columns = [
        {
            title: 'Titel',
            dataIndex: 'title',
            key: 'title',
            render: (text, row) => <a href={"/opinions/" + row._id}>
                <Space>
                    {text}
                    {row.isTemplate ? <Tag color="green">Vorlage</Tag> : null}
                </Space>
            </a>,
            sorter: (a, b) => lower(a.title).localeCompare(lower(b.title)),
        },
        {
            title: 'Beschreibung',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => lower(a.description).localeCompare(lower(b.description)),
        },
        {
            title: '#Nr',
            dataIndex: 'opinionNo',
            key: 'opinionNo',
            sorter: (a, b) => lower(a.opinionNo).localeCompare(lower(b.opinionNo)),
            defaultSortOrder: 'descend'
        },
    ];

    if (isDesktop) {
        columns = columns.concat([
            {
                title: 'Kunde',
                dataIndex: 'customer',
                key: 'customer.name',
                render: (text, row) => row.customer.name,
                sorter: (a, b) => lower(a.customer.name).localeCompare(lower(b.customer.name)),
            },
            {
                title: 'Ort',
                dataIndex: 'customerCity',
                key: 'customer.city',
                render: (text, row) => row.customer.city,
                sorter: (a, b) => lower(a.customer.city).localeCompare(lower(b.customer.city)),
            },
        ]);
    }

    
    return (
        <Fragment>
            <MediaQuery showAtPhone={true}>
                <List
                    itemLayout="horizontal"
                    dataSource={opinions}
                    loading={isLoading}
                    renderItem={opinion => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <a href={"/opinions/" + opinion._id}>
                                        <Space>
                                            {opinion.title}
                                            {
                                                opinion.isTemplate
                                                    ? <Tag color="green">Vorlage</Tag>
                                                    : null
                                            }
                                        </Space>
                                    </a>}
                                description={('Nr. ' + opinion.opinionNo + ' - ' + opinion.description + ' - ' + opinion.customer.name + ', ' + opinion.customer.city)}
                            />
                        </List.Item>
                    )}
                />
            </MediaQuery>

            <MediaQuery showAtTablet={true} showAtDesktop={true}>
                <Table
                    columns={columns} 
                    dataSource={opinions} 
                    loading={isLoading}
                    rowKey="_id"
                    pagination={false}
                    showSorterTooltip={false}
                />
            </MediaQuery>
        </Fragment>
    );
}
