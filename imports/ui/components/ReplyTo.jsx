import React, { Fragment, useState } from 'react';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import { MentionsWithEmojis } from './MentionsWithEmojis';

const { useForm } = Form;

export const ReplyTo = ( { refOpinion, refActivity } ) => {
    const [ showInput, setShowInput ] = useState(false);
    const [ working, setWorking ] = useState(false);
    const [ form ] = useForm();
    
    const toggleShowInput = () => { setShowInput(!showInput); }

    const onAnswerClick = () => {
        form.validateFields().then( values => {
            setWorking(true);

            setTimeout( _ => {
                Meteor.call('activities.replyTo', refOpinion, refActivity, values.answer, (err, res) => {
                    toggleShowInput();
                    setWorking(false);
                });
            }, 100);
        })
    }

    return (
        <Fragment>
            <span key="1" onClick={ toggleShowInput }>Antworten</span>
            { !showInput ? null : 
                <Form form={form}>
                    <Form.Item
                        name="answer"
                        rules={[
                            {
                                required: true,
                                message: 'Bitte geben Sie eine Antwort ein.',
                            },
                        ]}
                    >
                        <MentionsWithEmojis 
                            method="opinion.getSharedWith"
                            methodParams={refOpinion}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onAnswerClick} loading={working} disabled={working} type="primary">
                            Antworten
                        </Button>
                    </Form.Item>
                </Form>
            }
        </Fragment>
    );
}