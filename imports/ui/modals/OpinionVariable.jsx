import { Meteor } from 'meteor/meteor';
import React, { Fragment, useState } from 'react';

import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import List from 'antd/lib/list';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Switch from 'antd/lib/switch';

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';

import { ModalBackground } from '../components/ModalBackground';


const { Option } = Select;
const { useForm } = Form;

const AddButton = ({ show, onClick }) => {
    if (!show) return null;

    return (
        <Row>
            <Col span={20} offset={2}>
                <Button type="dashed" onClick={onClick || null} block><PlusOutlined/> Variable hinzufügen</Button>
            </Col>
        </Row>
    );
}

const EditButton = ({ show, onClick }) => {
    if (!show) return null;

    return (
        <EditOutlined onClick={onClick || null}/>
    );
}

const DeleteButton = ({ show, onClick }) => {
    if (!show) return null;

    return (
        <DeleteOutlined onClick={onClick || null}/>
    );
}

const textualPreface = {
    EDIT: 'Bitte ändern Sie die Daten des angezeigten Teilnehmers und bestätigen Sie Ihre Eingaben mit OK.',
    NEW: 'Zum Erstellen eines neuen Teilnehmers füllen Sie bitte die nachfolgenden Feler aus und bestätigen mit OK.'
}

export const ModalOpinionVariable = ( { mode/*NEW|EDIT|DELETE*/, refOpinion, variable, canEdit=false }) => {
    const [ showModal, setShowModal ] = useState(false);
    const [ form ] = useForm();

    const handleModalCancel = () => {
        setShowModal(false);
    }

    const handleModalOk = () => {
        form.validateFields().then( values => {
            const method = mode === 'NEW' ? 'opinion.addVariable':'opinion.updateVariable';
            
            if (mode == "EDIT") {
                values._id = variable && variable._id || null;
            }
            Meteor.call(method, refOpinion, values, (err, res) => {
                if (err) {
                    return Modal.error({
                        title: 'Fehler',
                        content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                    });
                }

                form.resetFields();
                setShowModal(false);
            });
        });
    }

    const removeVariable = () => {
        Modal.confirm({
            title: 'Löschen',
            icon: <ExclamationCircleOutlined />,
            content: 
                <p>Möchten Sie die Variable <strong>{variable.name}</strong> wirklich löschen?</p>
            ,
            okText: 'Ja',
            cancelText: 'Nein',
            onOk: closeConfirm => {
                Meteor.call('opinion.removeVariable', refOpinion, variable, (err, res) => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                        });
                    }
    
                    closeConfirm();
                });
            }
        });
    }

    const showEditDialog = () => {
        setShowModal(true);

        setTimeout( () => {
            form.setFieldsValue(variable);
        }, 50);
    }

    const ModalVariable = () => {
        if (!showModal)
            return null;

        return (
            <ModalBackground>
                <Modal
                    title={ mode === 'EDIT' ? 'Variable bearbeiten' : 'Neue Variable' }
                    visible={ true }
                    onOk={ handleModalOk }
                    onCancel={ handleModalCancel }
                    maskClosable={false}
                >
                    <p>{textualPreface[mode]}</p>

                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleModalOk}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Bitte geben Sie den Namen ein.',
                                },
                            ]}
                        >
                            <Input autoFocus disabled={mode=='EDIT'} placeholder="Name der Variable"/>
                        </Form.Item>

                        <Form.Item
                            label="Wert"
                            name="value"
                        >
                            <Input autoFocus={mode=='EDIT'} placeholder="Wert"/>
                        </Form.Item>

                        <Form.Item
                            label="Wert für neues Dokument übernehmen"
                            name="copyValue"
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                    </Form>
                </Modal>
            </ModalBackground>
        )
    }

    if (mode == 'NEW') {
        return (
            <Fragment>
                <AddButton show={canEdit} onClick={e=>setShowModal(true)} />
                <ModalVariable />
            </Fragment>
        );
    } else if (mode == 'EDIT') {
        return (
            <Fragment>
                <EditButton show={canEdit} onClick={showEditDialog} />
                <ModalVariable />
            </Fragment>
        );
    } else if (mode == 'DELETE') {
        return (
            <Fragment>
                <DeleteButton show={canEdit} onClick={removeVariable} />
                <ModalVariable />
            </Fragment>
        );
    }
    return 'Unknown mode "' + mode + '"';
}