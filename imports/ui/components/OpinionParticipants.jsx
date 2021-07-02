import React from 'react'

import List from 'antd/lib/list';
import Empty from 'antd/lib/empty';

import { ModalOpinionParticipant } from '../modals/OpinionParticipant';

export const OpinionParticipants = ({refOpinion, participants, currentUser, canEdit=false, canDelete=false}) => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={participants}
            locale={{
                emptyText: <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>keine Teilnehmer vorhanden</span>}
                />
            }}
            renderItem={
                p => <ModalOpinionParticipant refOpinion={refOpinion} mode="EDIT" participant={p} canEdit={canEdit} />
            }
            
            footer={
                !canEdit ? null : <ModalOpinionParticipant refOpinion={refOpinion} mode="NEW" canEdit={canEdit} />
            }
        />
    );
};
