import React, { Fragment, useEffect, useState } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { MediaQuery } from '../client/mediaQueries';

import PageHeader from 'antd/lib/page-header';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import Breadcrumb from 'antd/lib/breadcrumb';
import Affix from 'antd/lib/affix';
import Form from 'antd/lib/form';
import message from 'antd/lib/message';

import Layout from 'antd/lib/layout';
const { Header, Content, Footer, Sider } = Layout;

const { useForm } = Form;

import { ModLayout } from './ModLayout';

import { useModule, useProduct, useRecord } from '../client/trackers';


export const Record = ({ params, mode }) => {
    const { productId, moduleId, recordId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);

    const [ reloadRevision, setReloadRevision ] = useState(0);
    const [ record, recordLoading ] = useRecord(productId, moduleId, recordId, reloadRevision);
    
    const [ recordMode, setRecordMode ] = useState(mode);

    const [ recordForm ] = useForm();

    useEffect( () => {
        if (record) {
            setTimeout( () => recordForm.setFieldsValue(record), 50);
        }
    });

    if (productLoading || modLoading || recordLoading)
        return null;
    
    // aktuell wird nur das default-layout unterstützt
    const layout = mod.layouts && mod.layouts.default;
    
    const saveRecord = e => {
        recordForm.validateFields().then( values => {
            const data = {
                productId: product._id,
                moduleId: mod._id,
                values
            }
            const methodeName = recordMode === 'NEW' ? 'insertRecord' : 'updateRecord';

            if (recordMode === 'EDIT') {
                data._id = recordId;
            }

            Meteor.call('modules.' + methodeName, data, (err, res) => {
                if (err) {
                    return message.error('Es ist ein unbekannter Systemfehler aufgetreten. Bitte wenden Sie sich an den Systemadministrator.' + err.message);
                }

                const { status, messageText, recordId } = res;

                if (status === 'critical') {
                    message.error('Ein nicht Systemfehler ist aufgetreten: ' + messageText);
                    return;
                }

                if (status === 'abort') {
                    message.error(messageText);
                    return;
                }

                if (status === 'warning') {
                    message.warning(messageText);
                }

                if (status === 'success') {
                    message.success(messageText);
                }

                if (status === 'info') {
                    message.info(messageText);
                }

                if (status === 'okay') {
                    message.success(messageText);
                }
                
                FlowRouter.go(`/records/${productId}/${moduleId}/${recordId}`);
            });

        }).catch(errorInfo => {
            //console.log(errorInfo);
            message.error('Es ist ein Fehler beim Speichern der Daten aufgetreten. Bitte überprüfen Sie Ihre Eingaben.');
        });
    }

    const editRecord = () => {
        if (recordMode === 'SHOW') setRecordMode('EDIT');
    }

    const cancelRecord = () => {
        if (recordMode === 'EDIT' && record && record._id) {
            setReloadRevision(reloadRevision + 1);
            setRecordMode('SHOW');
        } else if (recordMode === 'NEW') {
            history.back();
        }
    }

    let pageButtons = null;
    if (recordMode === 'NEW' || recordMode === 'EDIT') pageButtons = [
            <Button key="2" onClick={cancelRecord}>Abbruch</Button>,
            <Button key="1" type="primary" onClick={saveRecord}>Speichern</Button>,
        ]
    else if ( recordMode === 'SHOW') pageButtons = [
            <Button key="1" type="dashed" onClick={editRecord}>Bearbeiten</Button>,
        ]
    else
        pageButtons = [];

    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="">Home</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">Dashboards</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href={"/dashboards/" + product._id}>{product.title}</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {mod.title}
                </Breadcrumb.Item>
            </Breadcrumb>

            <Affix className="mbac-affix-style-bottom" offsetTop={66}>
                <PageHeader
                    title={<span><i className={mod.faIconName} style={{fontSize:32, marginRight:16 }}/>{recordMode !== 'NEW' ? record && record.title : ''}</span>}
                    subTitle={
                        <MediaQuery showAtTablet showAtDesktop >
                            <span style={{marginTop:8, display:'flex'}}>{recordMode === 'NEW' ? 'Neuzugang' : null} {`(${mod.namesAndMessages.singular.ohneArtikel})`}</span>
                        </MediaQuery>
                    }
                    tags={
                        <MediaQuery showAtTablet showAtDesktop >
                            {
                                recordMode === 'NEW' 
                                    ? <Tag color="orange" style={{marginTop:8, display:'flex'}}>nicht gespeichert</Tag>
                                    : <Tag color="green" style={{marginTop:8, display:'flex'}}>{record && record._id}</Tag>
                            }
                        </MediaQuery>
                    }
                    extra={pageButtons}
                    style={{borderBottom:'2px solid #e1e1e1', marginBottom:16}}
                />
            </Affix>

            <Form
                layout="horizontal"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={recordForm}
            >

                <ModLayout
                    product={product}
                    mod={mod}
                    record={record}
                    mode={recordMode}
                />
            </Form>
        </Fragment>
    );
}