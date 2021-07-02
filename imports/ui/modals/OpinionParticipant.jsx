import { Meteor } from 'meteor/meteor';
import React, { Fragment, useState } from 'react';

import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import List from 'antd/lib/list';

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';

import { ModalBackground, preventClickPropagation } from '../components/ModalBackground';

const { Option } = Select;
const { useForm } = Form;

const textualPreface = {
    EDIT: 'Bitte ändern Sie die Daten des angezeigten Teilnehmers und bestätigen Sie Ihre Eingaben mit OK.',
    NEW: 'Zum Erstellen eines neuen Teilnehmers füllen Sie bitte die nachfolgenden Feler aus und bestätigen mit OK.'
}

export const ModalOpinionParticipant = ( { mode/*NEW|EDIT*/, refOpinion, participant, canEdit=false }) => {
    const [ showModal, setShowModal ] = useState(false);
    const [ form ] = useForm();

    const handleModalCancel = () => {
        setShowModal(false);
    }

    const handleModalOk = () => {
        form.validateFields().then( values => {
            const participantMethod = mode === 'NEW' ? 'opinion.addParticipant':'opinion.updateParticipant';
            
            values.id = participant && participant.id || null;
            Meteor.call(participantMethod, refOpinion, values, (err, res) => {
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

    removeParticipant = () => {
        const { gender, lastName } = participant;

        Modal.confirm({
            title: 'Löschen',
            icon: <ExclamationCircleOutlined />,
            content: 
                <p>Möchten Sie den Teilnehmer <strong>{gender} {lastName}</strong> wirklich löschen?</p>
            ,
            okText: 'Ja',
            cancelText: 'Nein',
            onOk: closeConfirm => {
                Meteor.call('opinion.removeParticipant', refOpinion, participant, (err, res) => {
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

    editParticipant = () => {
        setShowModal(true);

        setTimeout( () => {
            form.setFieldsValue({ ...participant });
        }, 10);
    }

    newParticipant = () => {
        setShowModal(true);
    }

    const renderModal = () => {
        if (!showModal)
            return null;

        return (
            <ModalBackground>
                <Modal
                    title={ mode === 'EDIT' ? 'Teilnehmer bearbeiten' : 'Neuer Teilnehmer' }
                    visible={ true }
                    onOk={ handleModalOk }
                    onCancel={ handleModalCancel }
                    maskClosable={false}
                    onClick={ preventClickPropagation }
                >
                    <p>{textualPreface[mode]}</p>

                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleModalOk}
                    >
                        <Form.Item
                            label="Anrede"
                            name="gender"
                            rules={[
                                {
                                    required: true,
                                    message: 'Bitte geben Sie die Anrede des Teilnehmers an.',
                                },
                            ]}
                        >
                            <Select style={{ width: 360 }}>
                                <Option key="Herr" value="Herr">Herr</Option>
                                <Option key="Frau" value="Frau">Frau</Option>
                                <Option key="divers" value="divers">Divers</Option>
                            </Select>
                        </Form.Item>
                        
                        <Form.Item
                            label="Titel"
                            name="academicTitle"
                        >
                            <Input placeholder="Titel des Teilnehmers"/>
                        </Form.Item>

                        <Form.Item
                            label="Nachname"
                            name="lastName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Bitte geben Sie den Nachnamen ein.',
                                },
                            ]}
                        >
                            <Input placeholder="Nachname"/>
                        </Form.Item>

                        <Form.Item
                            label="Vorname"
                            name="firstName"
                        >
                            <Input placeholder="Vorname"/>
                        </Form.Item>

                        <Form.Item
                            label="Position"
                            name="position"
                        >
                            <Input placeholder="Position des TN (wenn bekannt)"/>
                        </Form.Item>

                        <Form.Item
                            label="Kommentar"
                            name="comment"
                        >
                            <Input.TextArea placeholder="Kommentar"/>
                        </Form.Item>
                    </Form>
                </Modal>
            </ModalBackground>
        )
    }

    if (mode === 'EDIT') {
        const { gender, academicTitle, firstName, lastName, comment } = participant;

        return (
            <Fragment>
                <List.Item
                    actions={!canEdit ? null : [
                        <DeleteOutlined key="1" onClick={ removeParticipant } />,
                        <EditOutlined key="2" onClick={ editParticipant } />
                    ]}
                >
                    <List.Item.Meta
                        title={(gender + ' ' + (academicTitle || '') + (academicTitle && academicTitle.length ? ' ':'') + (firstName || '') + (firstName && firstName.length ? ' ':'') + lastName)}
                        description={comment}
                    />
                </List.Item>
                
                { canEdit ? renderModal() : null }
            </Fragment>
        )
    } else {
        // mode === 'NEW'
        return ( 
            !canEdit 
                ? null
                : <Fragment>
                    <Button 
                        block
                        type="dashed"
                        icon={<PlusOutlined />} 
                        onClick={newParticipant}
                    >
                        Teilnehmer hinzufügen
                    </Button>
                    
                    { renderModal() }
                </Fragment>
        );
    }
}