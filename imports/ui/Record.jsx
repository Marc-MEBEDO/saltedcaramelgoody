import React, { Fragment, useState } from 'react';

import PageHeader from 'antd/lib/page-header';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import Breadcrumb from 'antd/lib/breadcrumb';
import Affix from 'antd/lib/affix';
import Form from 'antd/lib/form';
import message from 'antd/lib/message';

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
    
    const saveRecord = e => {
        recordForm.validateFields().then( values => {
            console.log(values);
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
                        <Button key="1" type="primary" onClick={saveRecord}>Speichern</Button>,
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