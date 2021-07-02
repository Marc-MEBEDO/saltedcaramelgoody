import React from 'react';

import Skeleton from 'antd/lib/skeleton';

import { Heading } from './detailtypes/Heading';
import { Text } from './detailtypes/Text';
import { Bestimmungen } from './detailtypes/Bestimmungen';
import { OpinionDetailAdder } from './detailtypes/OpinionDetailAdder';
import { Question } from './detailtypes/Question';
import { Answer } from './detailtypes/Answer';
import { ClassifiedOutput } from './detailtypes/ClassifiedOutput';
import { Pagebreak } from './detailtypes/Pagebreak';
import { Picture } from './detailtypes/Picture';
import { PictureContainer } from './detailtypes/PictureContainer';

import { useOpinionDetails } from '../../client/trackers';
import { ActionTodoList } from '../components/ActionTodoList';

export const ListOpinionDetails = ({ refOpinion, refParentDetail, depth = 1, disableDetailAdder = false, canEdit=false, canDelete=false, currentUser }) => {
    const [ opinionDetails, isLoading ] = useOpinionDetails(refOpinion, refParentDetail);
    const permissions = { canEdit, canDelete, currentUser };

    if (isLoading) return <Skeleton active />;
    
    const maxItems = opinionDetails.length;

    if (maxItems == 0 && canEdit) {
        return disableDetailAdder ? null : <OpinionDetailAdder pseudoItem={{refOpinion, refParentDetail, depth: depth + 1}} permissions={permissions} />
    }

    return opinionDetails.map( (detail, index) => {
        const props = {
            key: detail._id,
            item: detail, 
            permissions,
            first: (index===0),
            last: (maxItems===index+1),
            refOpinion
        }
        if (detail.type == 'HEADING') return <Heading {...props} />;
        if (detail.type == 'TEXT') return <Text {...props} />;
        if (detail.type == 'QUESTION') return <Question {...props} />;
        if (detail.type == 'ANSWER') return <Answer {...props} />;
        if (detail.type == 'BESTIMMUNGEN') return <Bestimmungen {...props} />;
        if (detail.type == 'PICTURE') return <Picture {...props} />;
        if (detail.type == 'PICTURECONTAINER') return <PictureContainer {...props} />;
        if (detail.type == 'PAGEBREAK') return <Pagebreak {...props} />;
        if (detail.type == 'TODOLIST') return <ActionTodoList {...props} />
        
        return <ClassifiedOutput {...props} />;
    });

};