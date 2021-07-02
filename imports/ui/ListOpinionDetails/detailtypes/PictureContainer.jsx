import React, { Fragment, useState } from 'react';

import { EditableContent } from '../../components/EditableContent';
import { OpinionDetailAdder } from './OpinionDetailAdder';
import { ListOpinionDetails } from '../ListOpinionDetails';
import { Link } from '../../components/Link';

import Space from 'antd/lib/space';

import RightCircleOutlined from '@ant-design/icons/RightCircleOutlined';
import PlusSquareOutlined from '@ant-design/icons/PlusSquareOutlined';
import MinusSquareOutlined from '@ant-design/icons/MinusSquareOutlined';

import { useAppState } from '../../../client/AppState';

export const PictureContainer = ( { item, permissions, first, last } ) => {
    const [ collapsed, setCollapsed ] = useState(true);
    const [ selectedDetail ] = useAppState('selectedDetail');

    let { _id, depth, printParentPosition, printPosition, printTitle, text, deleted } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';

    if (!printParentPosition) printPosition += '.';

    const toggleCollapse = e => {
        // check if we are currently in edit-mode of a detail
        if (selectedDetail) {
            if (selectedDetail.isDirty()) {
                return message.warning('Bitte beenden Sie zuerst Ihre aktuelle Bearbeitung.');
            } else {
                selectedDetail.discardChanges();
            }
        }
        setCollapsed(!collapsed);
    }

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={_id} className={`mbac-item-type-picture-container depth-${depth}`}>
                    <div className="mbac-title">
                        <Space>
                            { collapsed ? <PlusSquareOutlined onClick={toggleCollapse}/> : <MinusSquareOutlined onClick={toggleCollapse}/> }
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
                        </Space>
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
                    { collapsed || deleted ? null : 
                        <div className="mbac-child-content">
                            <ListOpinionDetails 
                                refOpinion={item.refOpinion}
                                refParentDetail={item._id}
                                canEdit={permissions.canEdit}
                                canDelete={permissions.canDelete}
                                currentUser={permissions.currentUser}
                                disableDetailAdder
                            />
                        </div>
                    }
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}