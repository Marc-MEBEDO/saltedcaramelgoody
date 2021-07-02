import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useRef } from 'react';
import List from 'antd/lib/list';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Comment from 'antd/lib/comment';
import Tooltip from 'antd/lib/tooltip';
import Modal from 'antd/lib/modal';

import moment from 'moment';
import localization from 'moment/locale/de';

//import { DiffDrawer } from './components/DiffDrawer';
import { DiffDrawer } from './components/Differ';
import { ReplyTo } from './components/ReplyTo';
import { MentionsWithEmojis } from './components/MentionsWithEmojis';

import { useOpinion, useActivities } from '../client/trackers';
import { hasPermission } from '../api/helpers/roles';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Expert } from './components/Expert';

export const ListActivities = ( { refOpinion, refDetail, currentUser, onClose } ) => {
    const [ opinion, opinionIsLoading ] = useOpinion(refOpinion);
    const [ activities, activitiesLoading ] = useActivities(refOpinion, FlowRouter.getQueryParam('activitiesBy') || refDetail);
    const [form] = Form.useForm();
    const activitiesEndRef = useRef(null);

    const [ currentTime, setTime ] = useState(new Date());
    const [ working, setWorking ] = useState(false);
    const [ canPostMessage, setCanPostMessage ] = useState(false);

    const parentRefDetail = refDetail;
    // We have to use the "wright" refDetail, so that a user-post will be stored to wright detail
    refDetail = FlowRouter.getQueryParam('activitiesBy') || refDetail;

    useEffect( () => {
        // check for hash in route
        const hash = FlowRouter.current().context.hash;
        if (!hash)
            // scroll to end of list
            activitiesEndRef.current.scrollIntoView(); //{ behavior: "smooth" })
        else {
            // scroll to hashed item
            const el = $('#' + hash).get(0);
            if (el) el.scrollIntoView();
        }
        
        const timer = setInterval( () => {
            setTime(new Date());
        }, 1000 * 60 /* 1x pro Minute*/);

        return function cleanup(){
            clearInterval(timer);
        }
    }, [activities/*, FlowRouter.getQueryParam('activitiesBy')*/]);


    if (currentUser && !opinionIsLoading && opinion) {
        let post = false,
            perm = { currentUser };

        const sharedWithUser = opinion.sharedWith.find( shared => shared.user.userId === currentUser._id );
        
        if (sharedWithUser && sharedWithUser.role) {
            perm.sharedRole = sharedWithUser.role;
        }
        
        post = hasPermission(perm, 'opinion.canPostMessage');
        
        if (post != canPostMessage) setCanPostMessage(post);
    }

    const postMessage = () => {
        form.validateFields().then( values => {
            setWorking(true);

            setTimeout( _ => {
                const activitiesBy = FlowRouter.getQueryParam('activitiesBy') || null;

                Meteor.call('activities.postmessage', refOpinion, refDetail, parentRefDetail, activitiesBy, values.message, (err, res) => {
                    setWorking(false);
                    
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                        });
                    }
                    form.resetFields();
                });
            }, 100);
        }).catch( info => {
            
        });
    }

    const renderAnswers = answers => {
        if (!answers || answers.length == 0)
            return null;

        return (
            <List
                itemLayout="horizontal"
                dataSource={answers}
                renderItem={ item => (
                    <li>
                        <Comment                        
                            author={item.createdBy.firstName + ' ' + item.createdBy.lastName}
                            avatar={<Expert onlyAvatar user={item.createdBy}/> /*<Avatar>{item.createdBy.firstName.charAt(0) + item.createdBy.lastName.charAt(0)}</Avatar>*/}
                            content={
                                <span dangerouslySetInnerHTML={ { __html: item.message } }></span>
                            }
                            datetime={
                                <Tooltip title={moment(item.createdAt).format('DD.MM.YYYY HH:mm')}>
                                    <span>{moment(item.createdAt).locale('de', localization).fromNow()}</span>
                                </Tooltip>
                            }
                        />
                    </li>
                )}
            />
        );
    }

    return (
        <div className="mbac-activities-sider">
            <div style={{height:55}}>
                <div style={{float:'left'}}>
                    <strong>Aktivitäten</strong>
                </div>
                <div
                    style={{float:'right'}}
                    onClick={ e => onClose()}
                >
                    X
                </div>
            </div>

            <List
                className="comment-list"
                itemLayout="horizontal"
                dataSource={activities}
                loading={activitiesLoading}
                renderItem={item => (
                    <li id={item._id}>
                        <Comment
                            actions={canPostMessage ? [
                                <ReplyTo refOpinion={refOpinion} refActivity={item._id} />
                            ] : []}
                            author={ item.createdBy.firstName + ' ' + item.createdBy.lastName }
                            avatar={ <Expert onlyAvatar user={item.createdBy}/> /*<Avatar>{item.createdBy.firstName.charAt(0) + item.createdBy.lastName.charAt(0)}</Avatar> */}
                            content={
                                <div>
                                    <span dangerouslySetInnerHTML={ { __html: item.message } }></span>
                                    { item.type == 'SYSTEM-LOG' 
                                        ? <DiffDrawer refOpinion={refOpinion} opinionDetailId={item.refDetailFinallyRemoved || item.refDetail} changes={item.changes} action={item.action} />
                                        : null
                                    }
                                    { renderAnswers(item.answers) }
                                </div>
                            }
                            datetime={
                                <Tooltip title={moment(item.createdAt).format('DD.MM.YYYY HH:mm')}>
                                    <span>{moment(item.createdAt).locale('de', localization).fromNow()}</span>
                                </Tooltip>
                            }
                        />
                    </li>
                )}
            />

            { !canPostMessage
                ? null
                : <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Nachricht"
                        name="message"
                        rules={[
                            {
                                required: true,
                                message: 'Bitte geben Sie eine Nachricht ein.',
                            },
                        ]}                
                    >
                        <MentionsWithEmojis
                            method="opinion.getSharedWith"
                            methodParams={refOpinion}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" loading={working} disabled={working} onClick={postMessage} type="primary">
                            Absenden
                        </Button>
                    </Form.Item>
                </Form>
            }

            <div ref={activitiesEndRef} />
        </div>
    );
}