import React, { Fragment, useState, useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Space from 'antd/lib/space';
import message from 'antd/lib/message';
import Collapse from 'antd/lib/collapse';
import Select from 'antd/lib/select';
import Table from 'antd/lib/table';

import ShareAltOutlined from '@ant-design/icons/ShareAltOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';

import { ModalBackground } from '../components/ModalBackground';
import { UserSearchInput } from '../components/UserSearchInput';
import { InvitableRoles } from '../components/invitable-roles';

const { useForm } = Form;
const { Option } = Select;
const { Panel } = Collapse;


const ShareWithForm = ({ validateFields, resetFields }) => {
    const [ form ] = useForm();



    return (
        <Form
            layout="vertical"
            form={form}
        >
            <Form.Item
                label="Benutzer"
                name="user"
                rules={[{
                        required: true,
                        message: 'Bitte wählen Sie einen Benutzer aus.',
                }]}
            >
                <UserSearchInput refOpinion={'notsupported'} searchMethod="getAll" />
            </Form.Item>
        </Form>
    );
}

export const ModalShareWith = ( { productId, moduleId, recordId, currentUser } ) => {
    const [ showModal, setShowModal ] = useState(false);
    const [ activePanel, setActivePanel ] = useState('INVITE-USER');
    const [ form ] = useForm();

    const closeDialog = e => {
        form.resetFields();

        setShowModal(false);
    }

    const showDialog = e => {
        e.preventDefault();

        setShowModal(true);
    }

    const handleOk = e => {
        if (activePanel == 'INVITE-USER') {
            form.validateFields(['user']).then( values => {
                const { user } = values;

                Meteor.call('users.shareWith', productId, moduleId, recordId, user, err => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein Fehler aufgetreten.\n' + err.message,
                        });
                    }
                    closeDialog();
                });
            });
        } else {
            form.validateFields(['email', 'gender', 'firstName', 'lastName', 'roles']).then( values => {
                Meteor.call('users.inviteUser', recordId, values, err => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein Fehler aufgetreten.\n' + err.message,
                        });
                    }
                    closeDialog();
                });
            });
        }
    }

    return (
        <Fragment>
            <Button type="dashed" onClick={ showDialog }>
                <Space>
                    <ShareAltOutlined />
                    Teilen
                </Space>
            </Button>

            { !showModal ? null :
                <ModalBackground>
                    <Modal
                        title={<span><ShareAltOutlined /> Dokument teilen</span>}
                        visible={ showModal }
                        onOk={ handleOk }
                        onCancel={ closeDialog }
                        maskClosable={false}
                    >
                        <Form 
                            layout="vertical"
                            form={form}
                        >
                            <Collapse ghost accordion bordered={false} defaultActiveKey={['INVITE-USER']} onChange={p=>setActivePanel(p)}>
                                <Panel key="INVITE-USER" header={<span>aktiven Benutzer einladen</span>}>
                                    <p>
                                        Zum Teilen dieses Dokuments mit anderen Benutzern wählen Sie bitte den entsprechenden Benutzer aus.
                                    </p>
                                    
                                    <Form.Item
                                        label="Benutzer"
                                        name="user"
                                        rules={[{
                                                required: true,
                                                message: 'Bitte wählen Sie einen Benutzer aus.',
                                        }]}
                                    >
                                        <UserSearchInput refOpinion={'notsupported'} searchMethod="getAll" />
                                    </Form.Item>
                                </Panel>

                                <Panel key="INVITE-BYMAIL" header={<span><strong>Benutzer nicht gefunden?</strong> Dann laden Sie hier die entsrechende Person per E-Mail ein.</span>}>
                                    <Form.Item
                                        label="E-Mail"
                                        name="email"
                                        rules={[{
                                            type: 'email',
                                            message: 'Bitte geben Sie eine gültige EMail-Adresse ein!',
                                          },{
                                            required: true,
                                            message: 'Bitte geben Sie die EMail-Adresse ein.',
                                        }]}
                                    >
                                        <Input prefix={<MailOutlined />} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Anrede"
                                        name="gender"
                                        rules={[{
                                            required: true,
                                            message: 'Bitte wählen Sie eine Anrede aus.',
                                        }]}
                                    >
                                        <Select>
                                            <Option key="Herr">Herr</Option>
                                            <Option key="Frau">Frau</Option>
                                            <Option key="divers">Divers</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Vorname"
                                        name="firstName"
                                        rules={[{
                                            required: true,
                                            message: 'Bitte geben Sie den Vornamen ein.',
                                        }]}
                                    >
                                        <Input prefix={<UserAddOutlined />} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Nachname"
                                        name="lastName"
                                        rules={[{
                                            required: true,
                                            message: 'Bitte geben Sie den Nachnamen ein.',
                                        }]}
                                    >
                                        <Input prefix={<UserAddOutlined />} />
                                    </Form.Item>

                                    <Form.Item
                                        name="roles"
                                    >
                                        <InvitableRoles />
                                        
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Form>
                    </Modal>
                </ModalBackground>
            }
        </Fragment>
    );
}
