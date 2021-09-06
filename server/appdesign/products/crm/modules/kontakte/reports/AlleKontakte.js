import React, { Fragment } from 'react';
import { check } from 'meteor/check';

import Image from 'antd/lib/image';

import { getModuleStore } from "../../../../../../../imports/coreapi";

export const ReportAlleKontakte = {
    _id: 'AlleKontakte',
    
    type: 'table',

    title: 'Alle Kontakte',
    description: 'Zeigt alle Kontakte im System.',

    sharedWith: [],
    sharedWithRoles: ['EVERYBODY'],

    columns: [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title, { _id }) => <a href={`/records/crm/kontakte/${_id}`}>{title}</a>
        },
        {
            title: 'Adressen',
            dataIndex: 'adresse',
            key: 'adresse',
            render: (adressen, doc) => {
                if (!adressen) return null;

                return (
                    <div>
                        { adressen.map( adr => <div key={adr._id} style={{marginBottom:8}}>
                            <img src={adr.imageUrl} style={{width:48,marginRight:8}}></img>
                            <a href={`/records/crm/adressen/${adr._id}`}>{adr.title}</a><br/>
                            <span style={{fontSize:10, color:'#bbb'}}>{adr.description}</span>
                        </div> ) }
                    </div>
                );
            },
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

    datasource: () => {
        const Kontakte = getModuleStore('kontakte');
        
        const data = Kontakte.find({}, { sort: { title: 1 }}).fetch().map( d => {
            d.key = d._id
            return d;
        });

        return data;
    },
}