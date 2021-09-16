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
    ctSingleModuleOption,
    ctDivider
 } from '../../../../../../imports/coreapi/controltypes';

import { FieldNamesAndMessages } from '../../../../../coreapi';
import { getModuleStore } from '../../../../../../imports/coreapi';
import { Teilnehmerstati } from './teilnehmerstati';

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
            activityRecordInserted: 'hat den Teilnehmer angelegt.'
        }
    },

    fields: {
        title: {
            type: 'String', 
            rules: [
                { required: true, message: 'Bitte geben Sie den Titel ein.' },    
            ],
            autoValue: ({ allValues }) => {
                const { teilnehmer } = allValues;
                
                if (teilnehmer && teilnehmer.length) return teilnehmer[0].title;
                
                return '';
            },
            ...FieldNamesAndMessages('der', 'Titel', 'die', 'Titel', { onUpdate: 'den Titel' }),
            ...defaultSecurityLevel
        },

        description: {
            type: 'String', 
            rules: [
                { required: true, message: 'Bitte geben Sie eine Beschreibung zum Teilnehmer an.' },    
            ],
            autoValue: ({ allValues }) => {
                const { seminar, teilnehmer } = allValues;

                if (seminar && seminar.length)
                    return seminar[0].title;
                return '';
            },
            ...FieldNamesAndMessages('die', 'Beschreibung', 'die', 'Beschreibungen'),
            ...defaultSecurityLevel
        },


        seminar: {
            type: 'Module',
            moduleDetails: {
                productId: 'akademie', 
                moduleId: 'seminare',
                hasDescription: true,
                description: doc => {
                    let datumVon, datumBis, datumsausgabe;

                    if (doc.datumVonBis && doc.datumVonBis[0]) datumVon = moment(doc.datumVonBis[0]).format('DD.MM.YYYY');
                    if (doc.datumVonBis && doc.datumVonBis[1]) datumBis = moment(doc.datumVonBis[1]).format('DD.MM.YYYY');

                    if (datumVon && !datumBis) datumsausgabe = datumVon;
                    if (datumVon && datumBis && datumVon == datumBis) datumsausgabe = datumVon;
                    if (datumVon && datumBis && datumVon != datumBis) datumsausgabe = datumVon + ' bis ' + datumBis;

                    return datumsausgabe + ' • '  + doc.status;
                },
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
                { field: 'description', controlType: ctStringInput },
                { title: 'Details der Teilnahme', controlType: ctDivider },
                { field: 'seminar', controlType: ctSingleModuleOption },
                { field: 'teilnehmer', controlType: ctSingleModuleOption, enabled: ({mode}) => mode == 'NEW' },
                { field: 'status', controlType: ctOptionInput, values: Teilnehmerstati, direction: 'horizontal', defaultValue: 'bestätigt' },
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
        defaults: ({ queryParams, moment }) => {
            let defaults = {
                status: 'angemeldet'
            }
    
            if (queryParams && queryParams.seminarId) {
                const Seminare = getModuleStore('seminare');

                const seminar = Seminare.findOne({ _id: queryParams.seminarId }, { fields: {_id:1, title:1, description:1}});
                if (seminar) {
                    defaults.seminar = [seminar];
                    /*defaults.seminar = [{
                        _id: seminar._id,
                        title: seminar.title,
                        description: seminar.description
                    }]*/
                }
            }
        
            return defaults;
        },
        onBeforeInsert: ({ teilnehmer, seminar }) => {
            // check ob Teilnehmer bereits zu diesem Seminar angemeldet ist
            const Seminarteilnehmer = getModuleStore('seminarteilnehmer');
            
            const teilnahme = Seminarteilnehmer.findOne({'teilnehmer._id': teilnehmer[0]._id, 'seminar._id': seminar[0]._id});

            if (teilnahme) {
                return { status: 'abort', messageText: 'Der ausgewählte Teilnehmer ist bereits angemeldet.' };
            }

            return { status: 'okay' };
        },

        onAfterInsert: values => {

        },

        onBeforeUpdate: (values, { _id }) => {

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