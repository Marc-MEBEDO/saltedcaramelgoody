import React, { Fragment, useEffect, useState } from 'react';

import Spinner from 'antd/lib/spin';
import PageHeader from 'antd/lib/page-header';
import Button from 'antd/lib/button';
//import Tag from 'antd/lib/tag';
import Breadcrumb from 'antd/lib/breadcrumb';
import Affix from 'antd/lib/affix';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Avatar from 'antd/lib/avatar';
import Card from 'antd/lib/card';
import Statistic from 'antd/lib/statistic';
import Table from 'antd/lib/table';

import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

/*const {
    Header, 
    Sider, 
    Content
} = Layout;*/

import { useModule, useProduct } from '../client/trackers';

import { FlowRouter } from 'meteor/kadira:flow-router';

export const GenericTableReport = ( { report }) => {
    const [ loadingData, setLoadingData ] = useState(true);
    const [ reportData, setReportData ] = useState(null);
    const [ firstTime, setFirstTime ] = useState(true);

    if (reportData === null && firstTime /*&& static = true*/) {
        Meteor.call('reports.' + report._id, {}, (err, result) => {
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

    if (report.columns) {
        report.columns = report.columns.map( c => {
            const fnCode = c.render;
            
            if (fnCode) {
                c.render = function renderColumn(col, doc) {
                    let renderer = eval(fnCode);
                    return renderer(col, doc, report.additionalData || {});
                }
            };
            
            return c;
        });
    }

    return (
        loadingData 
            ? <Spinner />
            : <Table dataSource={reportData} columns={report.columns} />
    );
}

export const GenericChart = ({element, options, chartType}) => {
    const type = chartType;
    const { static, report, params, onClick } = element;

    const [ loadingData, setLoadingData ] = useState(true);
    const [ data, setData ] = useState(null);
    
    useEffect( () => {
        if (static && data === null) {
            Meteor.call('reports.' + report._id, params, (err, result) => {
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
    const { moduleData, status: moduleStatus, message: moduleStatusMessage  } = useModule(moduleId);
    
    if (productLoading || moduleStatus == 'loading')
        return null;

    let dashboardPicker = () => { return 'no-dashboard' }
    if (moduleData.dashboards && moduleData.dashboards.dashboardPicker) dashboardPicker = eval(moduleData.dashboards.dashboardPicker);
    
    const dashboardName = dashboardPicker();
    const dashboard = (moduleData.dashboards || {})[dashboardName];
    
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
            else if ( element.type == 'table' )
                return <GenericTableReport report={element} />
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
                    {moduleData.title}
                </Breadcrumb.Item>
            </Breadcrumb>

            <Affix className="mbac-affix-style-bottom" offsetTop={64}>
                <PageHeader
                    title={<span><i className={moduleData.faIconName} style={{fontSize:32, marginRight:16 }}/>{moduleData.title}</span>}
                    subTitle={<span style={{marginTop:8, display:'flex'}}>{moduleData.description}</span>}
                    //tags={<Tag color="blue">Running</Tag>}
                    extra={ getExtras(moduleData.actions || {} ) }
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