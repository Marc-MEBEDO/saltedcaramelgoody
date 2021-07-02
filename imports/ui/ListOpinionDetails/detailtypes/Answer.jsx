import React, {Fragment, useState, useEffect, useRef} from 'react';
import { ListOpinionDetails } from '../ListOpinionDetails';
import { OpinionDetailAdder } from './OpinionDetailAdder';

//import RightCircleOutlined from '@ant-design/icons/RightCircleOutlined';

import { EditableContent } from '../../components/EditableContent';

export const Answer = ( { item, permissions, first, last } ) => {
    let { _id, depth, title, printTitle, text, actionCode, actionText, deleted, parentPosition, position } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';

    if (!parentPosition) position += '.';
    
    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={_id} className={`mbac-item-type-answer depth-${depth}`}>
                    <div className="mbac-title">
                        <EditableContent type="span" 
                            value={title}
                            field="title"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                    </div>
                    <div className="mbac-fix-title mbac-could-styled-as-deleted">
                        Antwort/Ist-Zustand
                    </div>
                    <div className="mbac-text">
                        <EditableContent type="wysiwyg" 
                            value={text}
                            field="text"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                    </div>
                    
                    { deleted ? null :
                        <div className="mbac-child-content">
                            <ListOpinionDetails 
                                refOpinion={item.refOpinion}
                                refParentDetail={item._id}
                                canEdit={permissions.canEdit}
                                canDelete={permissions.canDelete}
                                currentUser={permissions.currentUser}
                            />
                        </div>                    
                    }
                    <div className={`mbac-handlungsempfehlung ${actionCode}`}>
                        <div className="mbac-action-title mbac-could-styled-as-deleted">
                            Handlungsempfehlung
                        </div>
                        <div className="mbac-action-text">
                            <EditableContent type="wysiwyg" 
                                value={actionText}
                                field="actionText"
                                refDetail={_id}
                                item={item}
                                permissions={permissions}
                            />
                        </div>
                        <div className="mbac-action-longtext">
                            <EditableContent type="actioncode" 
                                value={actionCode}
                                field="actionCode"
                                refDetail={_id}
                                item={item}
                                permissions={permissions}
                            />
                        </div>
                    </div>
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}