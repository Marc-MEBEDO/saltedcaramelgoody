import React, { Fragment } from 'react';

import { ListOpinionDetails } from '../ListOpinionDetails';
import { OpinionDetailAdder } from './OpinionDetailAdder';

import RightCircleOutlined from '@ant-design/icons/RightCircleOutlined';

import { EditableContent } from '../../components/EditableContent';
import { Link } from '../../components/Link';

export const Question = ( { item, permissions, first, last } ) => {
    let { _id, depth, printTitle, actionText, actionCode, text, deleted, printParentPosition, printPosition } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';

    if (!printParentPosition) printPosition += '.';

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={_id} className={`mbac-item-type-question depth-${depth}`}>
                    <div className="mbac-title">
                        <span className="mbac-position mbac-media-screen">{printParentPosition}{printPosition}</span>
                        <EditableContent type="span" 
                            value={printTitle}
                            field="printTitle"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                        <Link canCancel href={`/opinions/${item.refOpinion}/${item._id}`}>
                            <RightCircleOutlined />
                        </Link>
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
                    <div className={`mbac-abschlussbetrachtung ${actionCode || 'unset'}`}>
                        <h3>Details zur Abschlussbetrachtung</h3>
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
                                value={actionCode || 'unset'}
                                field="actionCode"
                                refDetail={_id}
                                item={item}
                                permissions={permissions}
                            />
                        </div>
                    </div>

                    <div className="mbac-child-content">
                        <ListOpinionDetails 
                            refOpinion={item.refOpinion}
                            refParentDetail={item._id}
                            canEdit={permissions.canEdit}
                            canDelete={permissions.canDelete}
                            currentUser={permissions.currentUser}
                        />
                    </div>
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}