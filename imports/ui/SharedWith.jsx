import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import List from 'antd/lib/list';
import Tag from 'antd/lib/tag';
import Skeleton from 'antd/lib/skeleton';
import Typography from 'antd/lib/typography';
import Select from 'antd/lib/select';
import Space from 'antd/lib/space';

const { Text, Link } = Typography;

import { Expert } from './components/Expert';
import { useModule, useRecord, useRoles } from '../client/trackers';

const firstLetterUppercase = text => {
    return text[0].toUpperCase() + text.substring(1);
}

const Headline = ({ module }) => {
    const { mitArtikel } = module.namesAndMessages.singular;
    const moduleName = firstLetterUppercase(mitArtikel);

    return (
        <Text>
            { moduleName } wurde mit nachfolgenden Personen geteilt:
        </Text>
    )
}

const SharedWithRoles = ( { productId, moduleId, recordId, currentUser } ) => {
    const [roles, rolesLoading ] = useRoles();
    //const roles = ['ADMIN', 'JEDER', 'EXTERN', 'AKADEMIE', 'CONSULTING', 'MEBEDO AC'];
    const [ selectedRoles, setSelectedRoles ] = useState([]);

    const handleChange = selectedItems => {
        setSelectedRoles(selectedItems);
    }

    //const filteredRoles = roles.filter(o => !selectedRoles.includes(o));

    return <Space direction="vertical">
        <Tag size="" color="blue" closable>ADMIN</Tag>
        <Tag color="orange" closable>EXTERN</Tag>
    </Space>
    
    return (
        <Select
            mode="multiple"
            value={selectedRoles}
            onChange={handleChange}
            loading={rolesLoading}
            style={{ width: '100%' }}
        >
            {roles.map(item => (
                <Select.Option key={item._id} value={item._id}>
                    {item.rolename}
                </Select.Option>
            ))}
        </Select>
    );
}



export const SharedWith = ( { productId, moduleId, recordId, currentUser } ) => {
    const [ module, moduleLoading ] = useModule(moduleId);
    const [ record, recordLoading ] = useRecord(productId, moduleId, recordId, 0);

    const sharedWith = record && record.sharedWith || [];
    const sharedWithRoles = record && record.sharedWithRoles || [];

    return (
        <Fragment>
            {   moduleLoading
                    ? <Skeleton paragraph={{ rows: 2 }} />
                    : <Headline module={module} />
            }
            <List
                className="list-shared-with-users"
                itemLayout="vertical"
                dataSource={sharedWith}
                loading={moduleLoading || recordLoading}
                renderItem={item => (
                    <li key={item.user._id} style={{height:48,marginTop:8,borderBottom:'1px solid #e1e1e1'}}>
                        <Space>
                            <Expert onlyAvatar user={item.user}/>
                            <Text>{item.user.firstName + ' ' + item.user.lastName}</Text>
                        </Space>
                    </li>
                )}
            />

            <p style={{marginTop:16}}>
                <Text>
                    Des Weiteren haben alle Personen die den nachfolgenden Gruppen angehören Zugriff:
                </Text>
            </p>
            <SharedWithRoles productId={productId} moduleId={moduleId} recordId={recordId} currentUser={currentUser} />
        </Fragment>
    )
}

/*                    <List.Item key={item.user._id}>
                        <List.Item.Meta
                            avatar={<Expert onlyAvatar user={item.user}/>}
                            title={<Text>{item.user.firstName + ' ' + item.user.lastName}</Text>}
                        />
                    </List.Item>

                    */