import React, { Fragment, useEffect, useRef, useState } from 'react'

import Descriptions from 'antd/lib/descriptions';
import Skeleton from 'antd/lib/skeleton';
import Tag from 'antd/lib/tag';
import Table from 'antd/lib/table';
import Space from 'antd/lib/space';
import Tabs from 'antd/lib/tabs';

import ShareAltOutlined from '@ant-design/icons/ShareAltOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import FormOutlined from '@ant-design/icons/FormOutlined';
import FilePdfOutlined from '@ant-design/icons/FilePdfOutlined';
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import ImportOutlined from '@ant-design/icons/ImportOutlined';

import { useOpinion, useOpinionPdfs } from '../client/trackers';

import { OpinionParticipants } from './components/OpinionParticipants';
import { OpinionVariables } from './components/OpinionVariables';
import { ModalOpinion } from './modals/Opinion';
import { Expert } from './components/Expert';

import filesize from 'filesize';
import moment from 'moment';
import { useAppState } from '../client/AppState';

const { TabPane } = Tabs;


export const OpinionContent = ({refOpinion, currentUser, canEdit=false, canDelete=false, children, onTabPaneChanged}) => {
    const [ opinion, isLoading ] = useOpinion(refOpinion);
    const [ pdfs, isPdfLoading ] = useOpinionPdfs(refOpinion);

    onTabPaneChanged = onTabPaneChanged || function(){};

    const [ selectedDetail ] = useAppState('selectedDetail');
    
    if (isLoading) {
        return (
            <Skeleton paragraph={{ rows: 4 }} />
        );
    }

    const disableTabPanes = (selectedDetail && selectedDetail.mode == 'EDIT');

    return (
        <Tabs onChange={onTabPaneChanged} size="large" tabPosition={window.innerWidth > 800 ? 'left':'top'}>
            <TabPane tab={<span><FormOutlined />Dokument</span>} key="DOCUMENT">
                {children}
            </TabPane>

            <TabPane disabled={disableTabPanes} tab={<span><ContactsOutlined />Allgemein</span>} key="GENERAL">
                { !opinion.isTemplate ? null :
                    <p><Tag size="large" color="green">Vorlage</Tag></p>
                }

                <Descriptions 
                    layout="vertical"
                    size="small"
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                >
                    <Descriptions.Item label="Titel">{opinion.title} Nr. {opinion.opinionNo}</Descriptions.Item>
                    <Descriptions.Item label="Beschreibung">{opinion.description}</Descriptions.Item>
                    
                    <Descriptions.Item label="Kunde" span={2}>
                        <div>{opinion.customer.name}</div>
                        <div>{opinion.customer.street}</div>
                        <div>{opinion.customer.postalCode + ' ' + opinion.customer.city}</div>
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Datum von">{moment(opinion.dateFrom).format('DD. MMMM YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Datum bis">{moment(opinion.dateTill).format('DD. MMMM YYYY')}</Descriptions.Item>

                    { opinion.isTemplate ? null :  /* keine Teilnehmer und Gutachter in einer Vorlage */
                        <Fragment>
                            <Descriptions.Item label="Teilnehmer" span={2}>
                                <OpinionParticipants 
                                    refOpinion={refOpinion} 
                                    participants={opinion.participants} 
                                    currentUser={currentUser} 
                                    canEdit={canEdit} 
                                    canDelete={canDelete} 
                                />
                            </Descriptions.Item>

                            <Descriptions.Item label="Gutachter 1">
                                { opinion.expert1 
                                    ? <Expert user={opinion.expert1} />
                                    : <ModalOpinion 
                                            mode='EDIT' refOpinion={refOpinion} 
                                            buttonCaption="Jetzt Gutachter festlegen" 
                                            buttonType="dashed"
                                            defaultTab="Erweitert"
                                    />
                                }
                            </Descriptions.Item>

                            <Descriptions.Item label="Gutachter 2">
                                <Expert user={opinion.expert2} />
                            </Descriptions.Item>
                        </Fragment>
                    }
                </Descriptions>
            </TabPane>

            <TabPane tab={<span><ImportOutlined />Variablen</span>} key="VARS" disabled={disableTabPanes} >
                <OpinionVariables
                    refOpinion={refOpinion}
                    data={opinion.userVariables || []} 
                    permissions={{canEdit, canDelete}}
                />
            </TabPane>

            <TabPane tab={<span><FilePdfOutlined />PDF</span>} key="PDF" disabled={disableTabPanes} >
                <Table
                    //bordered
                    size="small"
                    loading={isPdfLoading}
                    pagination={false}
                    dataSource={pdfs}
                    rowKey="_id"
                    showHeader={false}
                    columns={[
                        {
                            title: 'Titel',
                            dataIndex: 'title',
                            key: 'title',
                            render: (text, item) => <a href={item.link} target="_blank">
                                <Space><FilePdfOutlined /><span>Gutachtliche Stellungnahme</span></Space>
                            </a>
                        }, {
                            title: 'Erstellt am',
                            dataIndex: 'meta.createdAt',
                            key: 'createdAt',
                            render: (text, item) => moment(item.meta.createdAt).format('DD.MM.YYYY HH:mm:ss')
                        }, {
                            title: 'Erstellt von',
                            dataIndex: 'meta.createdBy',
                            key: 'createdBy',
                            render: (text, item) => {
                                if (!item.meta.createdBy) return 'Unbekannt';
                                
                                const { firstName, lastName } = item.meta.createdBy;
                                
                                return `${firstName} ${lastName}`
                            }
                        }, {
                            title: 'Größe',
                            dataIndex: 'size',
                            key: 'size',
                            align:"right",
                            render: size => filesize(size)
                        }, {
                            title: 'Status',
                            dataIndex: '_id',
                            key: '_id',
                            align:"center",
                            render: (_id, item, index) => <Space>
                                <Tag color={index==0?"green":"orange"}>{index == 0 ? 'Aktuell':'Entwurf'}</Tag>
                                <Tag color="blue">v{pdfs.length - index}</Tag>
                            </Space>
                        }
                    ]}
                />
            </TabPane>

            <TabPane tab={<span><ShareAltOutlined />geteilt mit</span>} key="SHARE" disabled={disableTabPanes}>
                <Table
                    size="small"
                    loading={false}
                    pagination={false}
                    dataSource={opinion.sharedWith}
                    rowKey={ shw => shw.user.userId }
                    showHeader={false}
                    columns={[
                        {
                            title: 'Benutzer',
                            dataIndex: 'title',
                            key: 'title',
                            render: (text, shw) => {
                                const { userId, firstName, lastName } = shw.user;
                                return <Expert key={userId} user={{userId, firstName, lastName}} />
                            }
                        }, {
                            title: 'Rolle',
                            dataIndex: 'role',
                            key: 'role',
                            render: (text, shd) => <Tag color="orange">{shd.role}</Tag>
                        }, {
                            title: 'Rolle',
                            dataIndex: 'role',
                            key: 'role',
                            align: 'right',
                            render: (text, shd) => {
                                return <Space size='large'>
                                    <EditOutlined key="edit" />
                                    <DeleteOutlined key="ellipsis" />
                                </Space>
                            }
                        }
                    ]}
                />
            </TabPane>
        </Tabs>
    )
}