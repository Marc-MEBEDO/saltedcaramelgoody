import React from 'react';
import { check } from 'meteor/check';

import Tag from 'antd/lib/tag';

import { getModuleStore } from "../../../../../../../imports/coreapi";
import { Kundenarten } from '../kundenarten';

export const ReportAdressenByKundenart = {
    _id: 'AdressenByKundenart',
    
    type: 'table',
    typedetail:'pie',

    title: 'Adressen gem. Kundenart',
    description: 'Zeigt die Adressen, die der angegebenen Kundenart entspricht.',

    sharedWith: [],
    sharedWithRoles: ['EVERYBODY'],

    columns: [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title, { _id }) => <a href={`/records/crm/adressen/${_id}`}>{title}</a>
        },
        {
            title: 'Art',
            dataIndex: 'kundenart',
            key: 'kundenart',
            render: (kundenart, doc, { kundenarten } /*additionalData*/) => {
                const ka = kundenarten.find( k => k._id == kundenart );

                return (
                    <Tag color={(ka && ka.color) || 'blue'}>{(ka && ka.title) || kundenart}</Tag>
                );
            },
        },
        {
            title: 'Anschrift',
            dataIndex: 'anschrift',
            key: 'anschrift',
            render: (_, doc) => {
                return (
                    <div>
                        <span>{doc.firma1}</span>
                        <span>{doc.firma2}</span>
                        <span>{doc.firma3}</span>
                        <br />
                        <span>{doc.strasse}</span>
                        <br />
                        <span>{doc.plz} - {doc.ort}</span>
                    </div>
                )
            }
        },
        /*{
            title: 'Firma',
            dataIndex: 'firma1',
            key: 'firma1',
        },
        {
            title: 'Strasse',
            dataIndex: 'strasse',
            key: 'strasse',
        },
        {
            title: 'Plz',
            dataIndex: 'plz',
            key: 'plz',
        },
        {
            title: 'Ort',
            dataIndex: 'ort',
            key: 'ort',
        },*/
    ],

    datasource: ({ kundenart }) => {
        check(kundenart, String);

        const Adressen = getModuleStore('adressen');
        
        const data = Adressen.find({ kundenart }, {sort: { title: 1}}).fetch().map( d => {
            d.key = d._id
            return d;
        });

        return data;
    },

    additionalData: {
        kundenarten: Kundenarten
    }
}