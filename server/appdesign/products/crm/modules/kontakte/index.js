import { defaultSecurityLevel } from './../../../../security';

import { FieldNamesAndMessages } from '../../../../../coreapi';

import {
    ctStringInput, 
    ctCollapsible,
    ctInlineCombination,
    ctSingleModuleOption,
    ctOptionInput,
    ctDivider
} from '../../../../../../imports/coreapi/controltypes';

import { Anreden } from './anreden';

import { ReportAlleKontakte } from './reports/AlleKontakte';

export const Kontakte = { 
    _id: "kontakte",

    title: "Kontakte",
    description: "Alle Kontakte, die von uns benötigt werden.",
    faIconName: 'fa-fw far fa-address-card',
    
    namesAndMessages: {
        singular: { mitArtikel: 'der Kontakt', ohneArtikel: 'Kontakt' },
        plural: { mitArtikel: 'die Kontakte', ohneArtikel: 'Kontakte' },

        // wenn vorhanden, dann wird die Message genutzt - ansonsten wird
        // die Msg generisch mit singular oder plural generiert
        messages: {
            activityRecordInserted: 'hat den Kontakt erstellt'
        }
    },

    fields: {
        title: { type: 'String', ...FieldNamesAndMessages('der', 'Titel', 'die', 'Titel', { onUpdate: 'den Titel'}), ...defaultSecurityLevel },
        anrede: { type: 'String', ...FieldNamesAndMessages('die', 'Anrede', 'die', 'Anreden'), ...defaultSecurityLevel },
        nachname: { type: 'String', ...FieldNamesAndMessages('der', 'Nachname', 'die', 'Nachnamen', { onUpdate: 'den Nachnamen'}), ...defaultSecurityLevel },
        vorname: { type: 'String', ...FieldNamesAndMessages('der', 'Vorname', 'die', 'Vornamen', { onUpdate: 'den Vornamen'}), ...defaultSecurityLevel },
        adresse: { 
            type: 'Module',
            moduleDetails: {
                productId: 'crm', 
                moduleId: 'adressen',
                hasDescription: true,
                description: doc => {
                    return doc.firma1 + ' • ' + doc.strasse + ' • ' + doc.plz + ' ' + doc.ort;
                },
                hasImage: true,
                imageUrl: doc => {
                    return doc.logoUri;
                },
                linkable: false
            },
            ...FieldNamesAndMessages('die', 'Adresse', 'die', 'Adressen'),
            ...defaultSecurityLevel 
        },
        telefon: { type: 'String', ...FieldNamesAndMessages('die', 'Telefonnummer', 'die', 'Telefonnummern'), ...defaultSecurityLevel },
        mobiltelefon: { type: 'String', ...FieldNamesAndMessages('das', 'Mobiltelefon', 'das', 'Mobiltelefon'), ...defaultSecurityLevel },
        telefax: { type: 'String', ...FieldNamesAndMessages('die', 'Telefaxnummer', 'die', 'Telefaxnummern'), ...defaultSecurityLevel },
        email: { type: 'String', ...FieldNamesAndMessages('die', 'E-Mailadresse', 'die', 'E-Mailadressen'), ...defaultSecurityLevel },
    },

    actions: {
        neu: {
            isPrimaryAction: true,

            description: 'Neuzugang eines Kontaktes',
            icon: 'fas fa-plus',
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            onExecute: { redirect: '/records/crm/kontakte/new' }
        },
    },

    layouts: {
        default: {
            title: 'Standard-layout',
            description: 'dies ist ein universallayout für alle Operationen',

            //visibleBy: ['EMPLOYEE'],
            
            elements: [
                { field: 'title', controlType: ctStringInput },
                { title: 'Name', controlType: ctDivider },
                { field: 'anrede', controlType: ctOptionInput, values: Anreden, direction: 'vertical', defaultValue: 'Herr' },
                { field: 'nachname', controlType: ctStringInput },
                { field: 'vorname', controlType: ctStringInput },
                { title: 'Firmenzugehörigkeit', controlType: ctDivider },
                { field: 'adresse', controlType: ctSingleModuleOption },
                { title: 'Kommunikation', controlType: ctCollapsible, elements: [
                    { field: 'telefon', controlType: ctStringInput },
                    { field: 'mobiltelefon', controlType: ctStringInput },
                    { field: 'telefax', controlType: ctStringInput },
                    { field: 'email', controlType: ctStringInput },
                ]},
            ]
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
                        ReportAlleKontakte,
                    ]
                },                
            ]
        },
    },

    reports: [
        ReportAlleKontakte,
    ]
};
