import React from 'react';

import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Space from 'antd/lib/space';
import Avatar from 'antd/lib/avatar';

import { ModalChangePassword } from '../modals/ChangePassword';

import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

export const UserMenu = ({ currentUser }) => {
    const { firstName, lastName } = currentUser && currentUser.userData || { firstName: '?', lastName: '?' };

    const handleUserMenuClick = ({ item, key, keyPath, domEvent }) => {
        switch (key) {
            case "LOGOUT":
                Meteor.logout();
                break;
        }
    }

    const menu = <Menu onClick={handleUserMenuClick}>
        <Menu.Item key="PROFILE">
            <a href="/profile">Mein Profil</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="CHANGE-PASSWORD">
            <ModalChangePassword currentUser={currentUser} />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="LOGOUT"><LogoutOutlined /> Abmelden</Menu.Item>
    </Menu>;

    return (
        <div className="mbac-usermenu">
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow >
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()} >
                    <Space>
                        <Avatar style={{ backgroundColor: 'orange', color: '#fff', verticalAlign: 'middle' }} /*size="large" gap={16}*/>
                            { firstName && firstName.length > 0
                                ? firstName.substring(0,1) + lastName.substring(0,1)
                                : lastName.substring(0,2)
                            }
                        </Avatar>
                        <div className="mbac-username">
                            { firstName + ' ' + lastName }
                        </div>
                    </Space>
                </a>
            </Dropdown>
        </div>
    )
}
