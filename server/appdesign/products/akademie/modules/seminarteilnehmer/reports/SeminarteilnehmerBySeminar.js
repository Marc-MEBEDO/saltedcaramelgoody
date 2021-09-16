import React, { Fragment } from 'react';
import { check } from 'meteor/check';

import Image from 'antd/lib/image';

import { getModuleStore } from "../../../../../../../imports/coreapi";
import { Teilnehmerstati } from '../teilnehmerstati';

const reportDefinition = {
    type: 'table',
    
    title: 'Seminarteilnehmer',
    description: 'Zeigt alle Seminarteilnehmer des ausgewählten Seminars an.',

    sharedWith: [],
    sharedWithRoles: ['EVERYBODY'],

    columns: [
        {
            title: 'Teilnehmer',
            dataIndex: 'title',
            key: 'title',
            render: function renderTeilnehmer(title, { _id }, { renderExport }) {
                return (
                    renderExport 
                        ? title
                        : <a href={`/records/akademie/seminarteilnehmer/${_id}`}>{title}</a>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, { _id }, { additionalData, renderExport } ) => {
                const { Teilnehmerstati } = additionalData;
                const tnStatus = Teilnehmerstati.find( ({_id}) => _id == status );
                
                if (!tnStatus) {
                    return renderExport ? '!!' + status : <Tag>{'!!' + status}</Tag>
                }
                return (
                    renderExport
                        ? tnStatus.title
                        : <Tag style={{color:tnStatus.color, backgroundColor:tnStatus.backgroundColor, borderColor:tnStatus.color}}>
                            {tnStatus.title}
                        </Tag>
                );
            },
        },
    ],

    actions: [
        {
            title: 'Neu',
            inGeneral: true,
            type: 'primary',

            description: 'Neuzugang eines Seminarteilnehmers',
            icon: 'fas fa-plus',
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            disabled: ({ mode, data, record, defaults, currentUser }) => mode == 'NEW',

            onExecute: { 
                redirect: '/records/akademie/seminarteilnehmer/new?seminarId={{parentRecord._id}}'
            }
        },
        {
            title: 'Export CSV',
            inGeneral: true,
            type: 'secondary',

            description: 'Export der Reportdaten als CSV',
            icon: 'fas fa-file-csv',
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            visible: ({ mode, data, record, defaults, currentUser }) => {
                console.log('checkVisible', mode, data )

                return mode != 'NEW'// && data && data.length > 0
            },

            onExecute: { 
                exportToCSV: { filename: 'Seminarteilnehmer.csv' }
            }
        },
        {
            title: 'Export PDF',
            inGeneral: true,
            type: 'more',

            description: 'Export der Reportdaten als PDF',
            icon: 'far fa-file-pdf',
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            disabled: ({ mode, data, defaults, currentUser }) => mode == 'NEW' || data.length == 0,

            onExecute: { 
                redirect: '/records/akademie/seminarteilnehmer/new?seminarId={{parentRecord._id}}'
            }
        },
        {
            title: 'Bearbeiten',
            inGeneral: false,
            type: 'primary',

            description: 'Bearbeiten eines Seminarteilnehmers',
            icon: 'far fa-edit',
            iconOnly: true,
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            onExecute: { 
                redirect: '/records/akademie/seminarteilnehmer/{{rowdoc._id}}'
            }
        },
        {
            title: 'Löschen',
            type: 'secondary',
            description: 'Löschen eines Seminarteilnehmers',
            icon: 'fas fa-trash',
            iconOnly: true,

            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            onExecute: { 
                // executes meteor method
                runScript: (props /*{ mode, data, record, defaults, currentUser, isServer }*/) => {
                    console.log('Run Script', props);
                }
            }
        },
        {
            title: 'Anmailen',
            type: 'more',
            description: 'Teilnehmer eine E-Mail schreiben',
            icon: 'fas fa-envelope',

            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            onExecute: { 
                // executes meteor method
                runScript: (props /*{ mode, data, record, defaults, currentUser, isServer }*/) => {
                    console.log('Run Script', props);
                }
            }
        }
    ]
};

export const ReportSeminarteilnehmerBySeminar = {
    _id: 'ReportSeminarteilnehmerBySeminar',
    
    isStatic: false,

    liveData: ({ record, mode, isServer, publication, currentUser }) => {
        if (mode === 'NEW' && isServer) return publication.ready();

        const _id = record._id || '';
        check(_id, String);

        const Seminarteilnehmer = getModuleStore('seminarteilnehmer');
        
        return Seminarteilnehmer.find({ 'seminar._id': _id }, { sort: { title: 1 } });
    },
    ...reportDefinition,

    additionalData: {
        Teilnehmerstati
    }
}
