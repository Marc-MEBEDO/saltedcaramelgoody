/* SORTABLE besipiel vor der Umstellung

import { Meteor } from 'meteor/meteor';

import React, {Fragment, useState} from 'react';
import { Tooltip, Row, Col, Modal, Space, Typography, List, Tag, Skeleton, } from 'antd';

import {
    ExclamationCircleOutlined,
    DeleteOutlined, DeleteTwoTone,
    LikeOutlined, LikeTwoTone,
    DislikeOutlined, DislikeTwoTone,
    MessageOutlined,
    MenuOutlined,
    ScissorOutlined,
    CheckOutlined
} from '@ant-design/icons';

import { ListImages } from './ListImages';
import { ActionCodeDropdown } from './components/ActionCodeDropdown';
import { ActionCodeTag } from './components/ActionCodeTag';

import { ModalOpinionDetail } from './../ui/modals/OpinionDetail';

import { hasPermission } from './../api/helpers/roles';
import { layouttypesObject } from './../api/constData/layouttypes';
import { actionCodes } from './../api/constData/actioncodes';

const { Link } = Typography;


const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);


import HTMLEllipsis from 'react-lines-ellipsis/lib/html'
import { 
    useOpinionSubscription,
    useOpinionDetails,
    useOpinion
} from '../client/trackers';

import { ActionTodoList } from './components/ActionTodoList';


import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableListItem = sortableElement(props => <li {...props} />);
const SortableContainer = sortableContainer(props => <ul {...props} />);


const OpinionDetailItemByType = ({ item, refOpinion }) => {
    if (item.type == 'PICTURE') {
        return (
            <Row gutter={[16,16]}>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <ListImages imageOrImages={item.files} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={16} xl={16}>
                    <HTMLEllipsis
                        unsafeHTML={item.text}
                        maxLine='12'
                        ellipsis='...'
                        basedOn='letters'
                    />
                </Col>
              </Row>            
        );
    }
    
    if (item.type == 'TODOLIST') {
        return  <ActionTodoList refOpinion={refOpinion} />
    }

    if (
        item.type == 'HEADING' ||
        item.type == 'QUESTION' ||
        item.type == 'ANSWER' ||
        item.type == 'BESTIMMUNGEN' ||
        item.type == 'HINT' ||
        item.type == 'INFO' ||
        item.type == 'IMPORTANT' ||
        item.type == 'TEXT'
    ) {
       
        return <div dangerouslySetInnerHTML={ {__html: item.htmlContent } } />
    }

    return (
        <HTMLEllipsis
            unsafeHTML={item.text}
            maxLine='12'
            ellipsis='...'
            basedOn='letters'
        />
    )
}


export const ListOpinionDetailsLinkable = ({ refOpinion, refParentDetail, canEdit=false, canDelete=false, currentUser }) => {
    //const [ showModalEdit, setShowModalEdit ] = useState(false);
    //const [ opinion, isLoadingOpinion ] = useOpinion(refOpinion);
    const [ rePositionedOpinionDetails, setRepositionedOpinionDetails ] = useState(null);

    const [ opinionDetails, isLoading ] = useOpinionDetails(refOpinion, refParentDetail, opiniondetails => {
        // kill temp sorted items, because the new items just arrived from the server :-)
        setRepositionedOpinionDetails(null);
    });

    const finallyRemoveDetail = id => {
        Modal.confirm({
            title: 'Löschen',
            icon: <ExclamationCircleOutlined />,
            content: 'Soll der Eintrag wirklich gelöscht werden?',
            okText: 'OK',
            cancelText: 'Abbruch',
            onOk: closeConfirm => {
                closeConfirm();

                Meteor.call('opinionDetail.finallyRemove', id, (err, res) => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                        });
                    }
                });
            }
        });
    }

    const toggleDeleted = id => {
        Meteor.call('opinionDetail.toggleDeleted', id, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            }
        });
    }

    const doSocial = (action, id) => {
        Meteor.call('opinionDetail.doSocial', action, id, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            }
        });
    }

    const doneBefore = arr => {
        const uid = Meteor.userId();
        
        return arr.filter( ({userId}) => userId == uid ).length > 0;
    }

    const listSocial = list => {
        return (
            <div className="mbac-tooltip-social-list">
                <ul className="ant-list">
                    {
                        list.map( ({userId, firstName, lastName}) => <li className="ant-list-item" key={userId}>{firstName + (firstName ? ' ':'') + lastName}</li>)
                    }
                </ul>
            </div> 
        );
    }

    checkAnswer = id => {
        Meteor.call('opinionDetail.checkAnswer', id, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            }
        });
    }

    const getListItemActions = item => {
        const actions = [
            <div key="like">
                <Tooltip className="mbac-simple-social-list" title={listSocial(item.likes)}>
                    <Space>
                        { doneBefore(item.likes)
                            ?<LikeTwoTone onClick={ e => {doSocial('like', item._id)} } />
                            :<LikeOutlined onClick={ e => {doSocial('like', item._id)} } />
                        }
                        <span>{item.likes.length}</span>
                    </Space>
                </Tooltip>
            </div>,
            <div key="dislike">
                <Tooltip className="mbac-simple-social-list" title={listSocial(item.dislikes)}>
                    <Space>
                        { doneBefore(item.dislikes)
                            ?<DislikeTwoTone onClick={ e => {doSocial('dislike', item._id)} } />
                            :<DislikeOutlined onClick={ e => {doSocial('dislike', item._id)} } />
                        }
                        <span>{item.dislikes.length}</span>
                    </Space>
                </Tooltip>
            </div>,

            <IconText icon={MessageOutlined} text={item.commentsCount + item.activitiesCount} key="list-vertical-message" />,
        ];

        if (canEdit) {
            actions.push(
                <div key="edit">
                    <ModalOpinionDetail mode="EDIT" buttonStyle="ICONONLY" refDetail={item._id} />
                </div>
            );

            // check-opition is only available
            // if the type is an answer
            if (item.type ==='ANSWER') {
                actions.push(
                    <div key="checked">
                        <CheckOutlined onClick={e => checkAnswer(item._id)} />
                    </div>
                );
            }

            // update the delete flag only needs edit-permission
            actions.push(
                <div key="deleted">
                    { !item.deleted
                        ?<DeleteOutlined key="1" onClick={ e => {e.stopPropagation(); toggleDeleted(item._id)}} />
                        :<DeleteTwoTone key="1" onClick={ e => {e.stopPropagation(); toggleDeleted(item._id)}} />
                    }
                </div>
            );
        }

        if (canDelete) {
            actions.push(
                <div key="finallyRemoved">
                    <ScissorOutlined onClick={e => finallyRemoveDetail(item._id)} />
                </div>
            );
        }

        return actions;
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const refDetail = opinionDetails[oldIndex]._id;
            opinionDetails[oldIndex].position = '***';
            const newItems = arrayMove(opinionDetails, oldIndex, newIndex)
            setRepositionedOpinionDetails(newItems);

            Meteor.call('opinionDetails.rePosition', refDetail, newIndex+1, (err, res) => {
                setRepositionedOpinionDetails(null);

                setTimeout(_=> {
                    if (rePositionedOpinionDetails !== null) {
                        setRepositionedOpinionDetails(null);
                    }
                }, 1000)
            })
            
        }
    };
    
    const renderItemAction = (action, index) => {
        return (
            <li key={index}>
                { action }
                <em className="ant-list-item-action-split"></em>
            </li>
        )
    }

    const renderItem = (item, index) => {
        return (
            <SortableListItem 
                index={index}
                className={`ant-list-item ant-list-item-no-flex ${item.deleted ? "item-deleted" : ""}` }
                key={item._id}
            >
                <div className="ant-list-item-main">
                    <div className="ant-list-item-meta">
                        <div className="ant-list-item-meta-content">
                            <h4 className="ant-list-item-meta-title">
                                <Tooltip title={item.title}>
                                    <Space>
                                        <DragHandle />
                                        <Link href={`/opinions/${item.refOpinion}/${item._id}`}>
                                            <Space>
                                                {   <Space>
                                                        <Tag color="blue">{item.position}</Tag>
                                                        <Tag color="green">{layouttypesObject[item.type].title}</Tag>
                                                    </Space>
                                                }
                                                <span>{item.title}</span>
                                                { item.type !== 'ANSWER' ? null :
                                                    <ActionCodeTag actionCode={item.actionCode} />
                                                }
                                            </Space>
                                        </Link>
                                    </Space>
                                </Tooltip>
                            </h4>
                            <div className="ant-list-item-meta-description">
                                <OpinionDetailItemByType item={item} refOpinion={refOpinion} />
                            </div>
                        </div>
                    </div>
                    <ul className="ant-list-item-action">
                        {getListItemActions(item).map( renderItemAction )}
                    </ul>
                </div>
                { item.type !== 'QUESTION' ? null :
                    <div className="ant-list-item-extra" style={{float:'right'}}>
                        <ActionCodeDropdown
                            refDetail={item._id}
                            value={item.actionCode}
                        />
                    </div>
                }
            </SortableListItem>
        );
    }

    return (
        <Fragment>
            <div className="ant-list ant-list-vertical ant-list-split opinion-details-list">
                <SortableContainer
                    useDragHandle
                    //helperClass="row-dragging"
                    onSortEnd={onSortEnd}
                    onSortStart={ e => console.log('Sort Start')}
                    className="ant-list-items"
                >
                    {(rePositionedOpinionDetails || opinionDetails).map(renderItem)}
                </SortableContainer>
            </div>


            <Skeleton loading={isLoading} paragraph={{rows:14}} />
        </Fragment>
    );
}*/