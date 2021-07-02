import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState } from 'react';

import message from 'antd/lib/message';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';

import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';

import { useAppState } from '../../../client/AppState';
import { layouttypesObject, selectableLayouttypes } from '../../../api/constData/layouttypes';

export const OpinionDetailAdder = ({pseudoItem, item, permissions, after}) => {
    const { canEdit } = permissions;
    // no permission, no DetailAdder :-)
    if (!canEdit) return null;

    const [ newPosition, setNewPositon ] = useState(null);
    const [ selectedDetail ] = useAppState('selectedDetail');

    const data = pseudoItem || item;

    const canDoAdd = () => {
        // while editing a opiniondetail this function is disabled
        if (selectedDetail) {
            if (selectedDetail.isDirty()) {
                message.warning('Sie befinden sich aktuell in der Bearbeitung. Bitte schließen Sie diesen Vorgang zuerst ab.');
                return false;
            }
            selectedDetail.discardChanges();
        }
        return true;
    }

    const addNewItemBefore = e => {
        if (!canDoAdd()) return;

        if (pseudoItem) {
            setNewPositon(1);
            return;
        }

        const newPos = item.position;
        setNewPositon(newPos);
    }

    const addNewItemAfter = e => {
        if (!canDoAdd()) return;

        const newPos = item.position + 1;
        setNewPositon(newPos);
    }

    const createItem = type => {
        const { defaultValues } = layouttypesObject[type];

        Meteor.call('opinionDetail.insert', {
            refOpinion: data.refOpinion,
            refParentDetail: data.refParentDetail,
            position: newPosition,
            ...defaultValues,
            type
        }, (err, res) => {
            console.log(err,res);
        })

        closeModal();
    }

    const closeModal = () => {
        setNewPositon(null);
    }
    
    const menuClick = ({ item, key, keyPath, domEvent }) => {
        createItem(key);
    }

    const menu = (
        <Menu onClick={menuClick}>
            {   
                selectableLayouttypes.map( ({_id, title}) => {
                    return (
                        <Menu.Item key={_id}>
                            {title}
                        </Menu.Item>
                    )
                })
            }
        </Menu>
    );
    
    return (
        <Fragment>           
           
            <div className={`mbac-action-plus mbac-action-add ${selectedDetail ? 'mbac-edit-mode-active':''} depth-${data.depth}`}>
                <Dropdown overlay={menu} 
                    trigger={['click']}
                 >
                    <PlusCircleOutlined 
                        onClick={after ? addNewItemAfter:addNewItemBefore}
                    />  
                </Dropdown>   
            </div>  
        </Fragment>
    )
}