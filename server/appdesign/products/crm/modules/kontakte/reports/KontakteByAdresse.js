import React, { Fragment } from 'react';
import { check } from 'meteor/check';

import Image from 'antd/lib/image';

import { getModuleStore } from "../../../../../../../imports/coreapi";

const reportDefinition = {
    type: 'table',
    
    title: 'Alle Kontakte zur ausgewählen Adresse',
    description: 'Zeigt alle Kontakte der ausgewählten Adresse an.',

    sharedWith: [],
    sharedWithRoles: ['EVERYBODY'],

    columns: [
        {
            title: 'Ansprechpartner',
            dataIndex: 'title',
            key: 'title',
            render: (title, { _id }) => <a href={`/records/crm/kontakte/${_id}`}>{title}</a>
        },
        {
            title: 'Telefon',
            dataIndex: 'telefon',
            key: 'telefon',
        },
        {
            title: 'Mobiltelefon',
            dataIndex: 'mobiltelefon',
            key: 'mobiltelefon',
        },
        {
            title: 'E-Mail',
            dataIndex: 'email',
            key: 'email',
            render: (email, { _id }) => <a href={`mailto:${email}`}>{email}</a>
        },
    ],
};

export const ReportKontakteByAdresse = {
    _id: 'ReportKontakteByAdresse',
    
    isStatic: false,

    liveData: ({ record, mode, isServer, publication, currentUser }) => {
        if (mode === 'NEW' && isServer) return publication.ready();

        const _id = record._id || '';
        check(_id, String);

        const Kontakte = getModuleStore('kontakte');
        
        return Kontakte.find({ 'adresse._id': _id }, { sort: { title: 1 } });
    },
    ...reportDefinition,
}


export const StaticReportKontakteByAdresse = {
    _id: 'StaticReportKontakteByAdresse',
    
    isStatic: true,

    datasource: ({ record, mode, isServer, datasource }) => {
        datasource.unblock();

        if (mode === 'NEW') return [];
        
        const _id = record._id || '';
        check(_id, String);

        const Kontakte = getModuleStore('kontakte');
        
        const data = Kontakte.find({ 'adresse._id': _id }, { sort: { title: 1 }}).fetch();

        return data;
    },
    ...reportDefinition,
}