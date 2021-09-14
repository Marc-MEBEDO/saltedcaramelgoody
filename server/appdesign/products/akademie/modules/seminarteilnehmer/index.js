import { defaultSecurityLevel } from './../../../../security';

import {
    ctStringInput, 
    ctCollapsible,
    ctInlineCombination,
    ctOptionInput,
    ctReport,
    ctGoogleMap,
    ctColumns,
    ctHtmlInput,
    ctDatespanInput,
    ctDateInput,
    ctSingleModuleOption
 } from '../../../../../../imports/coreapi/controltypes';

import { FieldNamesAndMessages } from '../../../../../coreapi';
import { getModuleStore } from '../../../../../../imports/coreapi';
import { Teilnehmestati } from './teilnehmerstati';

export const Seminarteilnehmer = {
    _id: "seminarteilnehmer",

    title: "Seminarteilnehmer", 
    description: "Alle Seminarteilnehmer, die ein Seminar angeboten oder teilgenommen haben.", 
    faIconName: 'fa-fw far fa-user',

    namesAndMessages: {
        singular: { mitArtikel: 'der Seminarteilnehmer', ohneArtikel: 'Seminarteilnehmer' },
        plural: { mitArtikel: 'die Seminareteilnehmer', ohneArtikel: 'Seminarteilnehmer' },

        // wenn vorhanden, dann wird die Message genutzt - ansonsten wird
        // die Msg generisch mit singular oder plural generiert
        messages: {

        }
    },

    fields: {
        title: { 
            type: 'String', 
            rules: [
                { required: true, message: 'Bitte geben Sie den Titel ein.' },    
            ],
            ...FieldNamesAndMessages('der', 'Titel', 'die', 'Titel', { onUpdate: 'den Titel' }),
            ...defaultSecurityLevel
        },

        seminar: {
            type: 'Module',
            moduleDetails: {
                productId: 'akademie', 
                moduleId: 'seminare',
                hasDescription: false,
                //description: doc => {
                //    return doc.firma1 + ' • ' + doc.strasse + ' • ' + doc.plz + ' ' + doc.ort;
                //},
                hasImage: false,
                //imageUrl: doc => {
                //    return doc.logoUri;
                //},
                linkable: false
            },
            rules: [
                { required: true, message: 'Bitte geben Sie das Seminar an.' },
            ],
            ...FieldNamesAndMessages('das', 'Seminar', 'die', 'Seminare'),
            ...defaultSecurityLevel
        },

        teilnehmer: {
            type: 'Module',
            moduleDetails: {
                productId: 'crm', 
                moduleId: 'kontakte',
                hasDescription: true,
                description: kontakt => {
                    return kontakt.adresse[0].description;
                },
                hasImage: true,
                imageUrl: kontakt => kontakt.adresse[0].imageUrl,
                linkable: false
            },
            rules: [
                { required: true, message: 'Bitte geben Sie den Teilnehmer an.' },
            ],
            ...FieldNamesAndMessages('der', 'Teilnehmer', 'die', 'Teilnehmer', { onUpdate: 'den Teilnehmer' }),
            ...defaultSecurityLevel
        },
        status: {
            type: 'String',
            rules: [
                { required: true, message: 'Bitte geben Sie den Status an.' },
            ],
            ...FieldNamesAndMessages('der', 'Status', 'die', 'Status', { onUpdate: 'den Status' } ),
            ...defaultSecurityLevel
        },
    },

    layouts: {
        default: {
            title: 'Standard-layout',
            description: 'dies ist ein universallayout für alle Operationen',

            //visibleBy: ['EMPLOYEE'],
            
            elements: [
                { field: 'title', controlType: ctStringInput },
                { field: 'seminar', controlType: ctSingleModuleOption },
                { field: 'teilnehmer', controlType: ctSingleModuleOption },                
                { field: 'status', controlType: ctOptionInput, values: Teilnehmestati, direction: 'horizontal', defaultValue: 'bestätigt' },
            ]
        },
    },

    actions: {
        neu: {
            isPrimaryAction: true,

            description: 'Neuzugang eines Teilnehmers',
            icon: 'fas fa-plus',
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            onExecute: { redirect: '/records/akademie/seminarteilnehmer/new' }
        },
    },

    methods: {
        /*defaults: ({ queryParams, record, isServer, moment }) => {
            // default für Status = "angelegt"
            return {
                title:'test',
                datumVonBis: [new Date(), new Date()],
                seminar: 'Seminartitel....',
                beschreibung: '<h1>Ziel</h1><p>Bitte geben Sie hier das Ziel des Seminars ein.</p><h1>Inhalt</h1><p>und hier noch ein bisschen Inhalt bitte...</p>',
                status: ''
            }
        },*/
        onBeforeInsert: ({ firma2 }) => {

            return { status: 'okay' };
        },

        onAfterInsert: values => {

        },

        onAfterUpdate: (values, { _id }) => {

            return { status: 'okay' };
        }
    },

    dashboards: {
        dashboardPicker: () => {
            /*if (this.user.roles.has('external')) return 'extern';
            if (this.user.roles.has('gf')) return ['default', 'extern'];*/

            return 'default';
        },

        default: {
            rows: [
                {
                    elements: [
                        
                    ]
                },
                {
                    elements: [
                        
                    ]
                },
            ]
        },

        extern: {

        },
    },

    reports: [
        
    ]
}