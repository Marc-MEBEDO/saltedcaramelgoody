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

import { useModule, useProduct, useReport } from '../client/trackers';


export const Report = ({ params, queryParams }) => {
    const { productId, moduleId, reportId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);
    const [ report, reportLoading ] = useReport(reportId);

    useEffect( () => {

    });

    console.log('Report.jsx', reportId, report, reportLoading)

    if (productLoading || modLoading || reportLoading)
        return null;

    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="">Home</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">Reports</a>
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
                    title={<span><i className="fas fa-digital-tachograph" style={{fontSize:32, marginRight:16 }}/>{report.title}</span>}
                    subTitle={report.description}
                    extra={null}
                    style={{borderBottom:'2px solid #e1e1e1', marginBottom:16}}
                />
            </Affix>

            <div>
                Hier kommt der Report hin
            </div>
        </Fragment>
    );
}