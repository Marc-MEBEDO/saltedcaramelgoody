import React, { Fragment } from 'react';
import { OpinionDetailAdder } from './OpinionDetailAdder';

import { EditableContent } from '../../components/EditableContent';

export const ClassifiedOutput = ( { item, permissions, first, last } ) => {
    const { _id, depth, printTitle, text, deleted } = item;
    const { classType, header } = {
        HINT: { classType: 'hint', header: 'Hinweis' },
        INFO: { classType: 'info', header: 'Information' },
        IMPORTANT: { classType: 'important', header: 'Wichtig' },
        RECOMMENDATION: { classType: 'recommendation', header: 'Empfehlung' },
        NOTE: { classType: 'note', header: 'Hinweis' },
        REMARK: { classType: 'remark', header: 'Anmerkung' },
        ATTENTION: { classType: 'attention', header: 'Achtung' },
        DEFINITION: { classType: 'definition', header: 'Definition' },
    }[item.type];
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={_id} className={`mbac-item-type-${classType} depth-${depth}`}>
                    <div className="mbac-fix-title">
                        {header}
                    </div>
                    {/*<div className="mbac-print-title">
                        <EditableContent type="span" 
                            value={printTitle}
                            field="printTitle"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                        </div>*/
                    }
                    <div className="mbac-text">
                        <EditableContent type="wysiwyg" 
                            value={text}
                            field="text"
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