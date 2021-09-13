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

import ShareAltOutlined from '@ant-design/icons/ShareAltOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';

import Layout from 'antd/lib/layout';
const { Header, Content, Footer, Sider } = Layout;

const { useForm } = Form;

import { ModLayout } from './ModLayout';
import { ModalShareWith } from './modals/share-with';

import { useModule, useProduct, useRecord } from '../client/trackers';

import moment from 'moment';
import localization from 'moment/locale/de';
import { useOnceWhen } from '../coreapi/helpers/react-hooks';

export const Record = ({ params, currentUser, mode }) => {
    const { productId, moduleId, recordId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);

    const [ reloadRevision, setReloadRevision ] = useState(0);
    const [ record, recordLoading ] = useRecord(productId, moduleId, recordId, reloadRevision);
    
    const [ recordMode, setRecordMode ] = useState(mode);

    const [ recordForm ] = useForm();

    useOnceWhen(() => !productLoading && !modLoading && !recordLoading, () => {
        if (mode === 'NEW') {
            Meteor.call('modules.getDefaults', {productId, moduleId}, (err, defaults) => { 
                if (err) {
                    return message.error('Es ist ein unbekannter Systemfehler beim ermitteln der Standardwerte aufgetreten. Bitte wenden Sie sich an den Systemadministrator.' + err.message);
                } else {
                    if (defaults) {
                        
                        Object.keys(mod.fields).forEach(f => {
                            const field = mod.fields[f];
                            const { type } = field;

                            if (type === 'Date' || type === 'Datespan') {
                                const v = defaults[f];
                                if (v) {
                                    defaults[f] = (type == 'Date' ) ? moment(v) : [moment(v[0]), moment(v[1])]
                                }
                            }
                        });

                        recordForm.setFieldsValue(defaults);
                    }
                }
            });
        } else {
            if (record) {
                /*Object.keys(mod.fields).forEach(f => {
                    const field = mod.fields[f];
                    const { type } = field;

                    if (type === 'Date' || type === 'Datespan') {
                        const v = record[f];
                        if (v) {
                            record[f] = (type == 'Date' ) ? moment(v) : [moment(v[0]), moment(v[1])]
                        }
                    }
                });*/

                recordForm.setFieldsValue(record);
            }
        }
    });

    //console.log('productLoading', productLoading);
    //console.log('modLoading', modLoading);
    //console.log('recordLoading', recordLoading);
    //console.log('recordMode', recordMode);
    //console.log('reloadRevision', reloadRevision);

    if (productLoading || modLoading || recordLoading)
        return null;
    
    // aktuell wird nur das default-layout unterstützt
    const layout = mod.layouts && mod.layouts.default;
    
    const saveRecord = e => {
        recordForm.validateFields().then( values => {
            const data = {
                productId: product._id,
                moduleId: mod._id,
                values //: JSON.parse(JSON.stringify(values))
            }

            // es müssen alle Date-Werte konvertiert werden, da diese als Funktionsausdruck von moment() vorliegen
            // uns nicht per Metor.call übertragen werden können
            Object.keys(mod.fields).forEach(f => {
                const field = mod.fields[f];
                const { type } = field;

                if (type === 'Date' || type === 'Datespan') {
                    const v = values[f];
                    if (data.values[f]) {
                        data.values[f] = type === 'Date' ? v.toDate() : [v[0].toDate(), v[1].toDate()]
                    }
                }
            });

            
            const methodeName = recordMode === 'NEW' ? 'insertRecord' : 'updateRecord';

            if (recordMode === 'EDIT') {
                data.recordId = recordId;
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
                                
                if (recordMode === 'NEW') {
                    // nach dem Neuzugang können wir auf den konkret gespeicherten Datensatz wechsel in der URL
                    FlowRouter.go(`/records/${productId}/${moduleId}/${recordId}`);
                }
                setRecordMode('SHOW');
            });

        }).catch(errorInfo => {
            console.log(errorInfo)
            message.error('Es ist ein Fehler beim Speichern der Daten aufgetreten. Bitte überprüfen Sie Ihre Eingaben.');
        });
    }

    const editRecord = () => {
        if (recordMode === 'SHOW') setRecordMode('EDIT');
    }

    const cancelRecord = () => {
        if (recordMode === 'EDIT' && record && record._id) {
            //setReloadRevision(reloadRevision + 1);
            setRecordMode('SHOW');

            // on cancel reset to original saved values
            //console.log('cancel', record, recordMode)
            //setTimeout(() => {
            recordForm.setFieldsValue(record);
            //    console.log('set', record)
            //}, 500);
        } else if (recordMode === 'NEW') {
            history.back();
        }
    }

    const shareRecord = () => {
        console.log('share clicked');
    }

    let pageButtons = null;
    if (recordMode === 'NEW' || recordMode === 'EDIT') pageButtons = [
            <Button key="cancelEdit" onClick={cancelRecord}>Abbruch</Button>,
            <Button key="save" type="primary" onClick={saveRecord}>Speichern</Button>,
        ]
    else if ( recordMode === 'SHOW') pageButtons = [
            <ModalShareWith key="share1" productId={productId} moduleId={moduleId} recordId={recordId} currentUser={currentUser} />,
            <Button key="edit" type="dashed" icon={<EditOutlined />} onClick={editRecord}>Bearbeiten</Button>,
        ]
    else
        pageButtons = [];


    let valuesChangeHooks = []
    const onFieldsChangeHook = (changedFields, allFields) => {
        //console.log('onFieldsChangeHook', changedFields, allFields);
    }

    const registerValuesChangeHook = fnHook => {
        if (!valuesChangeHooks.find(fn => fn === fnHook))
        valuesChangeHooks.push(fnHook);
    }

    const onValuesChangeHook = (changedValues, allValues) => {
        const setValue = (field, value) => {
            recordForm.setFieldsValue({[field]:value});
        }

        valuesChangeHooks.forEach(fn => fn(changedValues, allValues, setValue));
    }

    //console.log('Render Record', recordMode);

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
                    /*tags={
                        <MediaQuery showAtTablet showAtDesktop >
                            {
                                recordMode === 'NEW' 
                                    ? <Tag color="orange" style={{marginTop:8, display:'flex'}}>nicht gespeichert</Tag>
                                    : <Tag color="green" style={{marginTop:8, display:'flex'}}>{record && record._id}</Tag>
                            }
                        </MediaQuery>
                    }*/
                    extra={pageButtons}
                    style={{borderBottom:'2px solid #e1e1e1', marginBottom:16}}
                />
            </Affix>

            <Form
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                form={recordForm}

                onFieldsChange={onFieldsChangeHook}
                onValuesChange={onValuesChangeHook}

                preserve={false}
            >

                <ModLayout
                    product={product}
                    mod={mod}
                    record={record}
                    mode={recordMode}

                    onValuesChange={registerValuesChangeHook}
                />
            </Form>
        </Fragment>
    );
}

/*
export const Record = ({ params, currentUser, mode }) => {
    const { productId, moduleId, recordId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);

    const [ reloadRevision, setReloadRevision ] = useState(0);
    const [ record, recordLoading ] = useRecord(productId, moduleId, recordId, reloadRevision);
    
    const [ recordMode, setRecordMode ] = useState(mode);

    const [ recordForm ] = useForm();

    useEffect( () => {
        if (mode === 'NEW') {
            Meteor.call('modules.getDefaults', {productId, moduleId}, (err, defaults) => { 
                if (err) {
                    return message.error('Es ist ein unbekannter Systemfehler beim ermitteln der Standardwerte aufgetreten. Bitte wenden Sie sich an den Systemadministrator.' + err.message);
                } else {
                    if (defaults) {
                        console.log(defaults, mod, modLoading);
                        Object.keys(mod.fields).forEach(f => {
                            const field = mod.fields[f];
                            const { type } = field;

                            if (type === 'Date' || type === 'Datespan') {
                                const v = defaults[f];
                                if (v) {
                                    defaults[f] = (type == 'Date' ) ? moment(v) : [moment(v[0], moment(v[1]))]
                                }
                            }
                        })

                        recordForm.setFieldsValue(defaults);
                    }
                }
            });
        } else {
            if (record) {
                setTimeout( () => recordForm.setFieldsValue(record), 50);
            }
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
                values //: JSON.parse(JSON.stringify(values))
            }

            // es müssen alle Date-Werte konvertiert werden, da diese als Funktionsausdruck von moment() vorliegen
            // uns nicht per Metor.call übertragen werden können
            Object.keys(mod.fields).forEach(f => {
                const field = mod.fields[f];

                if (field.type === 'Date' || field.type === 'Datespan') {
                    const v = values[f];
                    console.log('Test:', v, typeof v, v instanceof moment)
                    if (data.values[f]) {
                        data.values[f] = v.toDate()
                    }
                }
            })
            //console.log(data);
            const methodeName = recordMode === 'NEW' ? 'insertRecord' : 'updateRecord';

            if (recordMode === 'EDIT') {
                data.recordId = recordId;
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
                                
                if (recordMode === 'NEW') {
                    // nach dem Neuzugang können wir auf den konkret gespeicherten Datensatz wechsel in der URL
                    FlowRouter.go(`/records/${productId}/${moduleId}/${recordId}`);
                }
                setRecordMode('SHOW');
            });

        }).catch(errorInfo => {
            console.log(errorInfo)
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

    const shareRecord = () => {
        console.log('share clicked');
    }

    let pageButtons = null;
    if (recordMode === 'NEW' || recordMode === 'EDIT') pageButtons = [
            <Button key="cancelEdit" onClick={cancelRecord}>Abbruch</Button>,
            <Button key="save" type="primary" onClick={saveRecord}>Speichern</Button>,
        ]
    else if ( recordMode === 'SHOW') pageButtons = [
            <ModalShareWith key="share1" productId={productId} moduleId={moduleId} recordId={recordId} currentUser={currentUser} />,
            <Button key="edit" type="dashed" icon={<EditOutlined />} onClick={editRecord}>Bearbeiten</Button>,
        ]
    else
        pageButtons = [];


    let valuesChangeHooks = []
    const onFieldsChangeHook = (changedFields, allFields) => {
        //console.log('onFieldsChangeHook', changedFields, allFields);
    }
    const registerValuesChangeHook = fnHook => {
        if (!valuesChangeHooks.find(fn => fn === fnHook))
        valuesChangeHooks.push(fnHook);
    }

    const onValuesChangeHook = (changedValues, allValues) => {
        //console.log('onValuesChangeHook', changedValues, allValues);

        const setValue = (field, value) => {
            //console.log('SET val:', field, value)
            recordForm.setFieldsValue({[field]:value});
        }

        valuesChangeHooks.forEach(fn => fn(changedValues, allValues, setValue));
    }

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
                   
                    extra={pageButtons}
                    style={{borderBottom:'2px solid #e1e1e1', marginBottom:16}}
                />
            </Affix>

            <Form
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                form={recordForm}

                onFieldsChange={onFieldsChangeHook}
                onValuesChange={onValuesChangeHook}

                preserve={false}
            >

                <ModLayout
                    product={product}
                    mod={mod}
                    record={record}
                    mode={recordMode}

                    onValuesChange={registerValuesChangeHook}
                />
            </Form>
        </Fragment>
    );
}*/