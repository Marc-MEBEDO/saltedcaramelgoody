import React, { Fragment, useState } from 'react';

//import Layout from 'antd/lib/layout';
import PageHeader from 'antd/lib/page-header';
import Button from 'antd/lib/button';
//import Tag from 'antd/lib/tag';
import Breadcrumb from 'antd/lib/breadcrumb';
import Affix from 'antd/lib/affix';

import { Row } from 'antd';
import { Col } from 'antd';
import { Avatar } from 'antd';
import { Card } from 'antd';
import { Statistic } from 'antd';

import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

/*const {
    Header, 
    Sider, 
    Content
} = Layout;*/

import { useModule, useProduct } from '../client/trackers';

import { FlowRouter } from 'meteor/kadira:flow-router';

export const Dashboard = ({ params }) => {
    const { productId, moduleId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);
    
    //const dashboardName = mod.dashboards.dashbardPicker();
    //const dashboard = mod.dashboards[dashboardName];



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
                        width: { xs:24, sm:24, md:24, lg:24, xl:24 },
                    }
                ]
            },
            {
                elements: [
                    { 
                        label: 'Kundenkontakte Balkendiagramm...',
                        type: 'chart',
                        chartType: 'Bar',
                        width: { xs:24, sm:24, md:24, lg:12, xl:12 },
                        data: {
                            labels: ['Fraport', 'SAP', 'TELEKOM', 'ENGIE', 'Equinix', 'Lillium'],
                            datasets: [
                              {
                                label: 'Anzahl Kontakte pro Adresse - Balkendiagramm...',
                                data: [12, 19, 3, 25, 11, 7],
                                fill: true,
                                //backgroundColor: 'rgb(43, 114, 34)',
                                //borderColor: 'rgba(255, 99, 132, 0.2)',
                                backgroundColor: [ 'red' , 'blue' , 'rgb(255, 99, 132)' , 'green' , 'black' , 'orange' ],
                              },
                            ],
                        },
                        /*options: {
                            scales: {
                              yAxes: [
                                {
                                  ticks: {
                                    beginAtZero: false,
                                  },
                                },
                              ],
                            },
                        }*/
                    },
                    { 
                        label: 'Kundenkontakte Liniendiagramm...',
                        type: 'chart',
                        chartType: 'Line',
                        width: { xs:24, sm:24, md:24, lg:12, xl:12 },
                        data: {
                            labels: ['Fraport', 'SAP', 'TELEKOM', 'ENGIE', 'Equinix', 'Lillium'],
                            datasets: [
                              {
                                label: 'Anzahl Kontakte pro Adresse - Liniendiagramm...',
                                data: [12, 19, 3, 25, 11, 7],
                                fill: true,
                                backgroundColor: 'rgb(29, 49, 141)',
                                //borderColor: 'rgba(255, 99, 132, 0.2)',
                              },
                            ],
                        },
                        /*options: {
                            scales: {
                              yAxes: [
                                {
                                  ticks: {
                                    beginAtZero: true,
                                  },
                                },
                              ],
                            },
                        }*/
                    }
                ]
            }
        ]
    }
    
    const { Meta } = Card;

    const renderWidget = ( element ) => {
        return <Card>
                <Meta
                    avatar={<Avatar icon={<i className={element.icon} />}/>}
                    title={element.label}/>
                <Statistic
                    value = {element.staticValue}
                    valueStyle = {{ color: element.color }}/>
            </Card>;
    }

    const renderChart = ( element ) => {
        if ( element.chartType == 'Bar' )
            return <Bar data={element.data} options={element.options} />;
        else if ( element.chartType == 'Line' )
            return <Line data={element.data} options={element.options} />;
        else
            return null;
    }

    const getElement = ( element ) => {
        if ( element.type ) {
            if ( element.type == 'widget' )
                return renderWidget( element );
            else if ( element.type == 'chart' )
                return renderChart( element );
            /*else if ( element.type == 'list' )
            else if ( element.type == 'table' )
            else if ( element.type == 'static-report' )
            else if ( element.type == 'dynamic-report' )*/
            else
                return element.label;
        }
        else
            return null;
    }

    const getElements = ( elements ) => {
        return ( elements.map( ( element ) => {
            if ( element ) {
                if ( element.width )
                    return <Col {...element.width}>{ getElement( element ) }</Col>;
                else
                    return <Col>{ getElement( element ) }</Col>;
            }
            else
                return null;
        }));
    };
    
    const DashboardRows = ({ rows }) => {
        return ( rows.map( ( row ) => {
            if ( row.elements && row.elements.length )
                return <Row gutter= {[16,16]}>{ getElements( row.elements ) }</Row>;
            else
                return null;
        }));
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

            <div>
                {
                    ( dashboard && dashboard.rows && dashboard.rows.length )
                        ? <DashboardRows
                            rows={dashboard.rows} 
                        />
                        : null
                }                
            </div>
        </Fragment>
    );
}