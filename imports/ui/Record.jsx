import React, { Fragment, useState } from 'react';

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

import { useModule, useProduct } from '../client/trackers';


export const Record = ({ params, mode }) => {
    const { productId, moduleId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);

    const [ recordForm ] = useForm();

    if (productLoading || modLoading)
        return null;
    
    // aktuell wird nur das default-layout unterstützt
    const layout = mod.layouts && mod.layouts.default;
    
    const insertRecord = e => {
        recordForm.validateFields().then( values => {
            const data = {
                productId: product._id,
                moduleId: mod._id,
                values
            }

            Meteor.call('modules.insertRecord', data, (err, res) => {
                if (err) {
                    message.error('Es ist ein unbekannter Systemfehler aufgetreten. Bitte wenden Sie sich an den Systemadministrator.');
                }

                const { status, messageText } = res;

                if (status === 'critical') {
                    message.error('Ein nicht Systemfehler ist aufgetreten: ' + messageText);
                }

                if (status === 'abort') {
                    message.error(messageText);
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

                // or okay ==> do nothing;
            });

        }).catch(errorInfo => {
            //console.log(errorInfo);
            message.error('Es ist ein Fehler beim Speichern der Daten aufgetreten. Bitte überprüfen Sie Ihre Eingaben.');
        });
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
                    title={<span><i className={mod.faIconName} style={{fontSize:32, marginRight:16 }}/>{mod.title}</span>}
                    subTitle={<span style={{marginTop:8, display:'flex'}}>Neuzugang</span>}
                    tags={<Tag color="orange" style={{marginTop:8, display:'flex'}}>nicht gespeichert</Tag>}
                    extra={[
                        <Button key="2">Abbruch</Button>,
                        <Button key="1" type="primary" onClick={insertRecord}>Speichern</Button>,
                    ]}
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
                    mode={mode}
                />
            </Form>
        </Fragment>
    );
}

/*
<Sider style={{
    overflow: 'hidden auto',
    //height: '100vh',
    position: 'fixed',
    right: 0,
}}
theme="light"
width="300"
collapsible
collapsedWidth="0"
>
<div>Mit irgendeinem Content</div>    
</Sider>
*/
