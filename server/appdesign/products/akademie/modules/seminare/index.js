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
    ctDateInput
 } from '../../../../../../imports/coreapi/controltypes';

import { FieldNamesAndMessages } from '../../../../../coreapi';
import { getModuleStore } from '../../../../../../imports/coreapi';
import { Seminarstati } from './seminarstati';

import { ReportSeminarteilnehmerBySeminar } from '../seminarteilnehmer/reports/SeminarteilnehmerBySeminar';

export const Seminare = {
    _id: "seminare",

    title: "Seminare", 
    description: "Alle Seminare, die von uns angeboten werden.", 
    faIconName: 'fa-fw far fa-building',

    namesAndMessages: {
        singular: { mitArtikel: 'das Seminar', ohneArtikel: 'Seminar' },
        plural: { mitArtikel: 'die Seminare', ohneArtikel: 'Seminare' },

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
            type: 'String',
            rules: [
                { required: true, message: 'Bitte geben Sie den Seminartitel ein.' },
            ],
            ...FieldNamesAndMessages('das', 'Seminar', 'die', 'Seminare'),
            ...defaultSecurityLevel
        },

        beschreibung: {
            type: 'String', 
            rules: [
                { required: true, message: 'Bitte geben Sie eine Seminarbeschreibung ein.' },
            ],
            ...FieldNamesAndMessages('die', 'Beschreibung', 'die', 'Beschreibungen'),
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

        datumVonBis: {
            type: 'Datespan',
            rules: [
                { required: true, message: 'Bitte geben Sie den Durchführungszeitraum an.' },
            ],
            ...FieldNamesAndMessages('der', 'Zeitraum', 'die', 'Zeiträume', { onUpdate: 'den Zeitraum' } ),
            ...defaultSecurityLevel
        }
    },

    layouts: {
        default: {
            title: 'Standard-layout',
            description: 'dies ist ein universallayout für alle Operationen',

            //visibleBy: ['EMPLOYEE'],
            
            elements: [
                { field: 'title', controlType: ctStringInput },
                { field: 'datumVonBis', title:'Durchführung von-bis', controlType: ctDatespanInput, 
                    enabled: ({changedValues, allValues, defaultSecurityValue}) => {
                        const { status } = allValues;
                        
                        if (status == 'durchgeführt' || status == 'abgerechnet')
                            return false;
                        return true;
                    },
                },
                { field: 'status', controlType: ctOptionInput, values: Seminarstati, direction: 'horizontal', defaultValue: 'kunde' },
                { field: 'seminar', controlType: ctStringInput },
                { field: 'beschreibung', controlType: ctHtmlInput },
                { title: 'Semteil', controlType: ctReport, reportId: ReportSeminarteilnehmerBySeminar._id },
            ]
        },
    },

    actions: {
        neu: {
            isPrimaryAction: true,

            description: 'Neuzugang eines Seminars',
            icon: 'fas fa-plus',
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            onExecute: { redirect: '/records/akademie/seminare/new' }
        },
    },

    methods: {
        defaults: ({ queryParams, record, isServer, moment }) => {
            // default für Status = "angelegt"
            return {
                title:'test',
                datumVonBis: [new Date(), new Date()],
                seminar: 'Seminartitel....',
                beschreibung: '<h1>Ziel</h1><p>Bitte geben Sie hier das Ziel des Seminars ein.</p><h1>Inhalt</h1><p>und hier noch ein bisschen Inhalt bitte...</p>',
                status: 'geplant'
            }
        },
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
        ReportSeminarteilnehmerBySeminar
    ]
}