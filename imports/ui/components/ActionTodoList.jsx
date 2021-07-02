import React, { Fragment } from 'react';
import Table from 'antd/lib/table';
import Tag from 'antd/lib/tag';

import { actionCodes } from '../../api/constData/actioncodes';
import { useOpinionActionList } from '../../client/trackers';
import { OpinionDetailAdder } from '../ListOpinionDetails/detailtypes/OpinionDetailAdder';
import { EditableContent } from './EditableContent';

export const ActionTodoList = ({item, refOpinion, last, permissions}) => {
    const [ actionListitems, isLoading ] = useOpinionActionList(refOpinion);
    
    const { _id, depth, text, deleted } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';

    const cols = [
        {
            title: 'Maßnahme',
            dataIndex: 'actionCode',
            key: 'actionCode',
            width: 250,
            render: code => <Tag color={actionCodes[code].color}>{actionCodes[code].text}</Tag>
        }, {
            title: 'Text',
            dataIndex: 'actionText',
            key: 'actionText',
            render: (actionText, record) => <a href={`/opinions/${record.refOpinion}/${record._id}`}>{actionText}</a>,
        }
    ];
    
    let groupedItems = [];
    Object.keys(actionCodes).forEach( code => {
        const filteredItems = actionListitems.filter( item => item.actionCode === code);

        if (filteredItems.length > 0) {
            groupedItems.push({
                key: code,
                actionCode: code,
                children: filteredItems
            });
        }
    });

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={_id} className={`mbac-item-type-todolist depth-${depth}`}>
                    <div className="mbac-text" >
                        <EditableContent type="wysiwyg" 
                            value={text}
                            field="text"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                    </div>
                    <div className="mbac-todolist">
                        <Table 
                            dataSource={groupedItems} 
                            columns={cols} 
                            pagination={false}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}