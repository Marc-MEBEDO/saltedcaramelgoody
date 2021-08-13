import React, { Fragment, useEffect, useState } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { MediaQuery } from '../client/mediaQueries';

import PageHeader from 'antd/lib/page-header';
import Button from 'antd/lib/button';
import Result from 'antd/lib/result';
import Breadcrumb from 'antd/lib/breadcrumb';
import Affix from 'antd/lib/affix';
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import Spinner from 'antd/lib/spin';

import Table from 'antd/lib/table';
import Layout from 'antd/lib/layout';

import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

const { Header, Content, Footer, Sider } = Layout;

const { useForm } = Form;

import { useModule, useProduct, useReport } from '../client/trackers';

export const Report = ({ params, queryParams }) => {
    const { productId, moduleId, reportId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);
    const [ report, reportLoading ] = useReport(reportId);

    const [ loadingData, setLoadingData ] = useState(true);
    const [ reportData, setReportData ] = useState(null);
    const [ firstTime, setFirstTime ] = useState(true);

    const queryP = queryParams;

    if (reportData === null && firstTime /*&& static = true*/) {
        Meteor.call('reports.' + reportId, queryParams, (err, result) => {
            if (err) {
                // mach was um den Anwender zu informieren, dass ein Fehler aufgetreten ist
                message.error(err.message);
            } else {
                setReportData(result);
                setLoadingData(false);
            }
        });
        setFirstTime(false);
    }

    const RenderReport = ({ repData , rep }) => {
        if ( rep.type == 'table')
            return <Table dataSource={repData} columns={rep.columns} />;
        else if ( rep.type == 'chart') {
            if ( queryP.typedetail && queryP.typedetail == 'bar' )
                return <Bar data={repData} />;
            else
                return <Line data={repData} />;
        }
        return null;
    }

    if (productLoading || modLoading || reportLoading)
        return null;

    if (!report) {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Sorry, Sie sind nicht berechtigt für diesen Report."
                extra={<Button type="primary" onClick={ () => history.back() }>Zurück</Button>}
            />
        )
    }

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

            { loadingData 
                ? <Spinner />
                : <RenderReport repData={reportData} rep={report} />
            }

        </Fragment>
    );
}