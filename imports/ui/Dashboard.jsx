import React, { Fragment, useState } from 'react';

import Layout from 'antd/lib/layout';
import PageHeader from 'antd/lib/page-header';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import Breadcrumb from 'antd/lib/breadcrumb';
import Affix from 'antd/lib/affix';

const {
    Header, 
    Sider, 
    Content
} = Layout;

import { useModule, useProduct } from '../client/trackers';

import { FlowRouter } from 'meteor/kadira:flow-router';


export const Dashboard = ({ params }) => {
    const { productId, moduleId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);
    
    //const dashbordName = mod.dashbords.dashbardPicker()
    //const dashboard = mod.dashboards[dashbordName];

    const sharedReportKunden = {
        label: 'Kunden',
        columns: [ 
            'title', 
            { firma: document => { return '' } }, 
            { strasse: 'Straße' },
            { plz: { label: 'Postleitzahl', value: document => 'D-' + document.plz }}
        ],
    }

    const dashboard = {
        rows: [
            {
                elements: [
                    { label: 'Kunden', type: 'widget', icon: 'far fa-building', color: '#6F4', staticValue: '1.236', width: { xs:24, sm:24, md:12, lg:8, xl:8 } },
                    { label: 'Hotels', type: 'widget', icon: 'far fa-hotel', color: 'orange', staticValue: '451', width: { xs:24, sm:24, md:12, lg:8, xl:8 } },
                    { label: 'Interessenten', type: 'widget', icon: 'far fa-hotel', color: 'blue', staticValue: '5.673', width: { xs:24, sm:24, md:12, lg:8, xl:8 } },
                ]
            },
            {
                elements: [
                    {   _id: 'ReportKundenStatic', 
                        type: 'static-report', ...sharedReportKunden,
                        width: { xs:24, sm:24, md:24, lg:24, xl:24 }
                    }
                ]
            }
        ]
    }

    if (productLoading || modLoading)
        return null;

    const actionClick = ( action ) => {
        return e => {
            if (action.onExecute && action.onExecute.redirect) {
                FlowRouter.go(action.onExecute.redirect);
            }
        }
    }

    const getExtras = ( actionsObj ) => {
        const actions = Object.keys(actionsObj);

        return actions.map( actionName => {
            const a = actionsObj[actionName];
            return (
                <Button 
                    key={actionName}
                    type={a.isPrimaryAction ? 'primary' : 'default'}
                    onClick={ actionClick(a) }
                >
                    {a.icon ? <i className={a.icon} style={{marginRight: 8}}/> : null} {a.title}
                </Button>
            )
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

            <Affix className="mbac-affix-style-bottom" offsetTop={64}>
                <PageHeader
                    title={<span><i className={mod.faIconName} style={{fontSize:32, marginRight:16 }}/>{mod.title}</span>}
                    subTitle={<span style={{marginTop:8, display:'flex'}}>{mod.description}</span>}
                    //tags={<Tag color="blue">Running</Tag>}
                    extra={ getExtras(mod.actions || {} ) }
                />
            </Affix>

            <div>Content</div>
        </Fragment>
    );
}