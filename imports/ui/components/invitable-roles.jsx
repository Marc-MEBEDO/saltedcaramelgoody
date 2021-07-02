import React, { Fragment, useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

import Table from 'antd/lib/table';

export class InvitableRoles extends React.Component{
    constructor(props) {
        super(props);

        const defaultValue = ['EVERYBODY'];
        this.state = {
            invitableRoles: [],
            selectedRowKeys: defaultValue,
            loading: true
        }

        if (this.props.onChange) this.props.onChange(defaultValue);
    }

    componentDidMount(){
        Meteor.call('users.getInvitableRoles', (err, roles) => {
            if (!err) {
                this.setState({ invitableRoles: roles, loading: false });
            } else {
                console.log(err)
            }
        });
    }

    render() {
        const { invitableRoles, selectedRowKeys, loading } = this.state;

        const rowSelection = {
            selectedRowKeys,
            hideSelectAll: true,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys });
                if (this.props.onChange) this.props.onChange(selectedRowKeys);
            },
            getCheckboxProps: (record) => { 
                return {
                    disabled: record.roleId === 'EVERYBODY',
                    // Column configuration not to be checked
                    name: record.roleId,
                }
            }
        }

        return (
            <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                columns={[
                    {
                        title: 'zugewiesene Rollen',
                        dataIndex: 'displayName',
                    },
                ]}
                dataSource={invitableRoles}
                pagination={false}
                rowKey="roleId"
                size="small"
                loading={loading}
            />
        )
    }
}