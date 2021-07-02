import React, { Fragment, useEffect, useRef, useState } from 'react'

import Table from 'antd/lib/table';
import Space from 'antd/lib/space';

import { ModalOpinionVariable } from './../modals/OpinionVariable';
import { Tag } from 'antd';

export const OpinionVariables = ({ refOpinion, data, permissions }) => {
    const { canEdit } = permissions;

    return <Fragment>
        <Table
            size="small"
            loading={false}
            pagination={false}
            dataSource={data}
            rowKey="_id"
            showHeader={false}
            columns={[
                {
                    title: 'Variable',
                    dataIndex: 'name',
                    key: 'name',
                    render: (name, variable) => {
                        return (
                            <Space size="large">
                                <span>{name}</span>
                                { variable.copyValue ? <Tag color="geekblue">Wert beibehalten</Tag> : null }
                            </Space>
                        )
                    }
                }, {
                    title: 'Wert',
                    dataIndex: 'value',
                    key: 'value',
                }, {
                    title: 'Action',
                    key: 'action',
                    align:"right",
                    render: (value, variable) => {
                        const props = { refOpinion, canEdit, variable };
                        return (
                            <Space size="large">
                                <ModalOpinionVariable mode="EDIT" {...props} />
                                <ModalOpinionVariable mode="DELETE" {...props} />
                            </Space>
                        )
                    }
                }
            ]}
            style={{marginBottom:16}}
        />

        <ModalOpinionVariable      
            mode="NEW"
            refOpinion={refOpinion}
            canEdit={canEdit}
        />
    </Fragment>;
}