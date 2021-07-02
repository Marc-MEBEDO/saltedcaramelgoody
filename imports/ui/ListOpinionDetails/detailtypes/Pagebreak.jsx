import React, { Fragment } from 'react';
import { EditableContent } from '../../components/EditableContent';
import { OpinionDetailAdder } from './OpinionDetailAdder';

export const Pagebreak = ( { item, permissions, first, last } ) => {
    const { _id, depth, text, deleted } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={_id} className={`mbac-item-type-pagebreak depth-${depth}`}>
                    <div className="mbac-border"></div>
                    <div className="mbac-border-title" >
                        <EditableContent type="span" 
                            elementType="Pagebreak"
                            value="Seitenumbruch"
                            field="title"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                    </div>
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}