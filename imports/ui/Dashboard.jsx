import React, { Fragment, useEffect, useState } from 'react';

import Spinner from 'antd/lib/spin';
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


export const GenericChart = ({element, options, chartType}) => {
    const type = chartType;
    const { static, report, params, onClick } = element;

    const [ loadingData, setLoadingData ] = useState(true);
    const [ data, setData ] = useState(null);
    
    useEffect( () => {
        if (static && data === null) {
            Meteor.call('reports.' + report._id, params, (err, result) => {
                console.log(report._id, err, result);
                if (err) {
                    // mach was um den Anwender zu informieren, dass ein Fehler aufgetreten ist
                } else {
                    setData(result);
                    setLoadingData(false);
                }
            });
        } else {
            // realtime

        }
    })

    drillDown = () => {
        if (onClick && onClick.redirect) {
            FlowRouter.go(onClick.redirect);
        }
    }

    if ( loadingData ) 
        return <Spinner />;

    return (
        <div onClick={drillDown} style={{cursor:'pointer'}} >
            { ( type == 'Bar')
            ? <Bar key={element._id} data={data} options={options} />
            : <Line key={element._id} data={data} options={options} /> }
        </div>
    );
}

export const GenericWidget = ({element}) => {
    const { static, report, params, onClick } = element;

    const [ loadingData, setLoadingData ] = useState(true);
    const [ data, setData ] = useState(null);
    
    
    useEffect( () => {
        if (static && data === null) {
            Meteor.call('reports.' + report._id, params, (err, result) => {
                console.log(report._id, err, result);

                if (err) {
                    // mach was um den Anwender zu informieren, dass ein Fehler aufgetreten ist
                } else {
                    setData(result);
                    setLoadingData(false);
                }
            });
        } else {
            // realtime

        }
    })

    drillDown = () => {
        if (onClick && onClick.redirect) {
            FlowRouter.go(onClick.redirect);
        }
    }

    if ( loadingData ) 
        return <Spinner />;

    return (
        <div onClick={drillDown} style={{cursor:'pointer'}} >
            <Card hoverable>
                <Card.Meta
                    avatar={<Avatar icon={<i className={data.icon || element.icon} />}/>}
                    title={data.label || element.label}
                />
                <Statistic
                    value={data.value}
                    valueStyle={{ color: data.color || element.color }}
                />
            </Card>
        </div>
    );
}

export const Dashboard = ({ params }) => {
    const { productId, moduleId } = params;

    const [ product, productLoading ] = useProduct(productId);
    const [ mod, modLoading ] = useModule(moduleId);
    
    if (productLoading || modLoading)
        return null;

    let dashboardPicker = () => { return 'no-dashboard' }
    if (mod.dashboards && mod.dashboards.dashboardPicker) dashboardPicker = eval(mod.dashboards.dashboardPicker);
    
    const dashboardName = dashboardPicker();
    const dashboard = (mod.dashboards || {})[dashboardName];
    
    const renderChart = ( element ) => {
        if ( element.typedetail == 'Bar' )
            return <GenericChart key={element.key} element={element} chartType='Bar'/>; //<Bar data={element.data} options={element.options} />;
        else if ( element.typedetail == 'Line' )
            return <GenericChart key={element.key} element={element} chartType='Line'/>; //<Line key={element.key} data={element.data} options={element.options} />;
        else
            return null;
    }

    const getElement = ( element ) => {
        if ( element.type ) {
            if ( element.type == 'widget' )
                return <GenericWidget element={element} />;
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
                    return <Col key={element._id} {...element.width}>{ getElement( element ) }</Col>;
                else
                    return <Col key={element._id}>{ getElement( element ) }</Col>;
            }
            else
                return null;
        }));
    };
    
    const DashboardRows = ({ rows }) => {
        return ( rows.map( ( row, index ) => {
            if ( row.elements && row.elements.length )
                return <Row key={index} gutter= {[16,16]}>{ getElements( row.elements ) }</Row>;
            else
                return null;
        }));
    }

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



    /*

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
                    { 
                        _id: "1", label: 'Kunden', type: 'widget', icon: 'far fa-building', color: '#6F4', width: { xs:24, sm:24, md:12, lg:8, xl:8 },
                        datasource: 'adressen.AnzahlKunden', static: true, 
                        onClick: { redirect: '/reports/crm/adressen/adressen.hotels' } 
                    },
                    { _id: "2", label: 'Hotels', type: 'widget', icon: 'far fa-user', color: 'orange', static: true, datasource: 'adressen.AnzahlHotels', width: { xs:24, sm:24, md:12, lg:8, xl:8 } },
                    { _id: "3", label: 'Interessenten', type: 'widget', icon: 'far fa-clock', color: 'blue', static: true, datasource: 'adressen.AnzahlInteressenten', width: { xs:24, sm:24, md:12, lg:8, xl:8 } },
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
                        _id: 'KundenkontakteBalkendiagramm',
                        label: 'Kundenkontakte Balkendiagramm...',
                        type: 'chart',
                        chartType: 'Bar',
                        width: { xs:24, sm:24, md:24, lg:12, xl:12 },
                        static: true,
                        datasource: 'adressen.AnzahlKontakte',
                        /*data: {
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
                        },*/
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
                    /*},
                    {
                        _id:'Kundenkontakte Liniendiagramm',
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
                        },*/
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
                    
    
    //const { Meta } = Card;

    /*const renderWidget = ( element ) => {
        return <Card>
                <Meta
                    avatar={<Avatar icon={<i className={element.icon} />}/>}
                    title={element.label}/>
                <Statistic
                    value = {element.staticValue}
                    valueStyle = {{ color: element.color }}/>
            </Card>;
    }*/