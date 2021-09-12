import { defaultSecurityLevel } from './../../../../security';

import {
    ctStringInput, 
    ctCollapsible,
    ctInlineCombination,
    ctOptionInput,
    ctReport,
    ctGoogleMap,
    ctColumns
 } from '../../../../../../imports/coreapi/controltypes';

import { ReportAdressenByKundenart } from './reports/AdressenByKundenart';
import { ReportAnzahlAdressenByKundenart } from './reports/AnzahlAdressenByKundenart';
import { ReportKontakteProAdresse } from './reports/KontakteProAdresse';
import { ReportKontakteByAdresse, StaticReportKontakteByAdresse } from '../kontakte/reports/KontakteByAdresse';

import { WidgetAnzahlKunden } from './widgets/AnzahlKunden';
import { WidgetAnzahlHotels } from './widgets/AnzahlHotels';
import { WidgetAnzahlInteressenten } from './widgets/AnzahlInteressenten';
import { WidgetAnzahlPartner } from './widgets/AnzahlPartner';

import { ChartKontakteProAdresseBar } from './reports/KontakteProAdresse';
import { ChartKontakteProAdresseLine } from './reports/KontakteProAdresse';

import { Kundenarten } from './kundenarten';

import { FieldNamesAndMessages } from '../../../../../coreapi';
import { getModuleStore } from '../../../../../../imports/coreapi';

export const Adressen = {
    _id: "adressen",

    title: "Adressen", 
    description: "Alle Adressen, die von uns benötigt werden.", 
    faIconName: 'fa-fw far fa-building',

    namesAndMessages: {
        singular: { mitArtikel: 'die Adresse', ohneArtikel: 'Adresse' },
        plural: { mitArtikel: 'die Adressen', ohneArtikel: 'Adressen' },

        // wenn vorhanden, dann wird die Message genutzt - ansonsten wird
        // die Msg generisch mit singular oder plural generiert
        messages: {

        }
    },

    fields: {
        title: { 
            type: 'String', 
            rules: [
                { required: true, message: 'Bitte geben Sie den Titel der Adresse ein.' },    
            ],
            ...FieldNamesAndMessages('der', 'Titel', 'die', 'Titel', { onUpdate: 'den Titel' }),
            /*x: {
                singular: { mitArtikel: 'der Titel', ohneArtikel: 'Titel' },
                plural: { mitArtikel: 'die Titel', ohneArtikel: 'Titel' },
                messages: {
                    // $Benutzer hat ***den Title***, ..., ... geändert 
                    onUpdate: 'den Title'
                }
            },*/
            autoValue: ({changedValues, allValues}) => {
                const { rufname, firma1, firma2, firma3, strasse, plz, ort} = allValues;
                
                let newValue = '';
                if (rufname) {
                    newValue = rufname;
                 } else {
                     newValue = firma1;
                    if (firma2) newValue += ' ' + firma2;
                    if (firma3) newValue += ' ' + firma3;
                }
                if (ort) newValue += ' (' + ort + ')';

                return newValue;
            },
            ...defaultSecurityLevel
        },

        rufname: {
            type: 'String',
            ...FieldNamesAndMessages('der', 'Rufname', 'die', 'Rufnamen', { onUpdate: 'den Rufnamen' }),
            ...defaultSecurityLevel
        },

        kundenart: {
            type: 'String', 
            rules: [
                { required: true, message: 'Bitte klassifizieren Sie die Adresse.' },
            ],
            ...FieldNamesAndMessages('die', 'Kundenart', 'die', 'Kundenarten'),
            /*namesAndMessages: {
                singular: { mitArtikel: 'die Kundenart', ohneArtikel: 'Kundenart' },
                plural: { mitArtikel: 'die Kundenarten', ohneArtikel: 'Kundenarten' },
                messages: {
                    // Der $$Benutzer hat ***die Kundenart***, das Feld "Firma 1", ... geändert 
                    onUpdate: 'die Kundenart'
                }
            },*/
            ...defaultSecurityLevel
        },

        firma1: {
            type: 'String',
            rules: [
                { required: true, message: 'Bitte geben Sie den Firmennamen ein.' },
                { min: 3, message: 'Bitte geben Sie mindestens 3 Zeichen für den Firmennamen ein.' },
                { max: 50, message: 'Bitte geben Sie maximal 50 Zeichen für den Firmenname ein.' },
            ],
            ...FieldNamesAndMessages('die', 'Firma 1', 'die', 'Firma 1', { onUpdate: 'das Feld "Firma 1"' } ),
            ...defaultSecurityLevel
        },

        firma2: { 
            type: 'String', 
            rules: [
                { max: 50, message: 'Bitte geben Sie maximal 50 Zeichen für den Firmenzusatz (2) ein.' },
            ],
            ...FieldNamesAndMessages('die', 'Firma 2', 'die', 'Firma 2', { onUpdate: 'das Feld "Firma 2"'} ),
            ...defaultSecurityLevel
        },
        firma3: { 
            type: 'String', 
            rules: [
                { max: 50, message: 'Bitte geben Sie maximal 50 Zeichen für den Firmenzusatz (3) ein.' },
                /*{ 
                    customValidator: ({ getFieldValue }) => ({
                        validator(_, value) {
                            const firma1 = getFieldValue('firma1');

                            if (!value || firma1 === value || firma1 === 'Hallo Welt') {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('Bitte geben den Wert "' + firma1 + '" erneut ein.'));
                        },
                    }),
                }*/
            ],
            ...FieldNamesAndMessages('die', 'Firma 3', 'die', 'Firma 3', { onUpdate: 'das Feld "Firma 3"'} ),
            ...defaultSecurityLevel },

        strasse: {
            type: 'String', 
            ...FieldNamesAndMessages('die', 'Straße', 'die', 'Straßen'),
            ...defaultSecurityLevel
        },

        plz: {
            type: 'String',
            ...FieldNamesAndMessages('die', 'PLZ', 'die', 'Postleitzahlen'),
            ...defaultSecurityLevel
        },

        ort: {
            type: 'String',
            ...FieldNamesAndMessages('der', 'Ort', 'die', 'Orte', { onUpdate: 'den Ort' }),
            ...defaultSecurityLevel
        },

        logoUri: {
            title: 'Logo',
            type: 'String',
            ...FieldNamesAndMessages('das', 'Logo', 'die', 'Logos'),
            ...defaultSecurityLevel
        },

        firmaRechnung: {
            title: 'Firma', 
            type: 'ArrayOfStrings',
            ...FieldNamesAndMessages('die', 'Firma (Rechnung)', 'die', 'Firma (Rechnung)', { onUpdate: 'das Feld "Firma (Rechnung)"' }),
            ...defaultSecurityLevel 
        },

        strasseRechnung: {
            type: 'String', 
            ...FieldNamesAndMessages('die', 'Straße (Rechnung)', 'die', 'Straße (Rechnung)', { onUpdate: 'das Feld "Straße (Rechnung)"' }),
            ...defaultSecurityLevel 
        },

        plzRechnung: { 
            type: 'String', 
            ...FieldNamesAndMessages('die', 'PLZ (Rechnung)', 'die', 'PLZ (Rechnung)', { onUpdate: 'das Feld "PLZ (Rechnung)"' }),
            ...defaultSecurityLevel 
        },
        ortRechnung: {
            type: 'String', 
            ...FieldNamesAndMessages('der', 'Ort', 'die', 'Orte', { onUpdate: 'den Ort (Rechnung)' }),
            ...defaultSecurityLevel
        },

        eMailRechnung: {
            title: 'E-Mailadresse für Rechnungsversandt', 
            type: 'String', 
            ...FieldNamesAndMessages('die', 'E-Mailadresse für den Rechnungsversandt', 'die', 'E-Mailadressen für den Rechnungsversandt'),
            ...defaultSecurityLevel
        },

        telefon: {
            type: 'String',
            ...FieldNamesAndMessages('die', 'Telefonnummer', 'die', 'Telefonnummern'),
            title: 'Telefon',
            ...defaultSecurityLevel
        },

        telefax: { 
            type: 'String',
            ...FieldNamesAndMessages('die', 'Telefaxnummer', 'die', 'Telefaxnummern'),
            ...defaultSecurityLevel 
        },
        website: {
            type: 'String',
            ...FieldNamesAndMessages('die', 'Webseite', 'die', 'Webseiten'),
            ...defaultSecurityLevel
        },

        email: {
            type: 'String', 
            ...FieldNamesAndMessages('die', 'E-Mailadresse', 'die', 'E-Mailadressen'),
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
                { field: 'rufname', controlType: ctStringInput },
                { field: 'logoUri', controlType: ctStringInput },
                { field: 'kundenart', controlType: ctOptionInput, values: Kundenarten, direction: 'vertical', defaultValue: 'kunde' },
        
                { controlType: ctColumns, columns: [
                    { title: 'Anschriftsdaten', columnDetails: { xs:24, sm:24, md:12, lg:12, xl:16 },  elements: [
                        { title: 'Anschriften', controlType: ctCollapsible, collapsedByDefault: true, elements: [
                            {  field: 'firma1',  controlType: ctStringInput },
                            {  field: 'firma2',  controlType: ctStringInput },
                            {  field: 'firma3',  controlType: ctStringInput },
                            {  field: 'strasse',  controlType: ctStringInput },
                            {  title: 'PLZ', controlType: ctInlineCombination, elements: [
                                { field: 'plz',  noTitle: true, controlType: ctStringInput },
                                { field: 'ort',  controlType: ctStringInput },
                            ]},
                        ]},
                    ]},
                    { title: 'Map', columnDetails: { xs:24, sm:24, md:12, lg:12, xl:8 }, elements: [
                        { 
                            title: 'Map', controlType: ctGoogleMap, 
                            googleMapDetails: {
                                location:  ({ currentLocation, record, mode, allValues, changeValues }) => {
                                    const { firma1, firma2, firma3, strasse, plz, ort} = allValues || record;                                    
                                    let newLocation = firma1 || '';

                                    if (firma2) newLocation += ' ' + firma2;
                                    if (firma3) newLocation += ' ' + firma3;
                                    if (strasse) newLocation += ', ' + strasse;
                                    if (plz) newLocation += ', ' + plz;
                                    if (ort) newLocation += ' ' + ort;
                
                                    return newLocation;
                                }
                            }
                        }
                    ]}
                ]},

                { title: 'Ansprechpartner1', controlType: ctReport, reportId: StaticReportKontakteByAdresse._id },
                { title: 'Ansprechpartner2', controlType: ctReport, reportId: ReportKontakteByAdresse._id },

                { title: 'Kommunikation', controlType: ctCollapsible, collapsedByDefault: false, elements: [
                    {  field: 'telefon',  controlType: ctStringInput },
                    {  field: 'telefax',  controlType: ctStringInput },
                    {  field: 'email',  title: 'E-Mailadresse', controlType: ctStringInput },
                    {  field: 'website',  controlType: ctStringInput },
                ]},

                { title: 'Kaufmännisch', controlType: ctCollapsible, collapsedByDefault: false, elements: [
                    { title: 'abweichende Rechnungsanschrift', controlType: ctCollapsible, elements: [
                        {  field: 'firmaRechnung',  controlType: ctStringInput },
                        {  field: 'strasseRechnung',  controlType: ctStringInput },
                        {  title: 'PLZ', controlType: ctInlineCombination, elements: [
                            { field: 'plzRechnung',  noTitle: true, controlType: ctStringInput },
                            { field: 'ortRechnung',  controlType: ctStringInput },
                        ]},
                    ]},

                    {  field: 'eMailRechnung',  controlType: ctStringInput },
                    //{  field: 'haarfarbe',  controlType: ctStringInput },
                ]},
            ]
        },

        extern: {
            title: 'Adresslayout für Kundenansicht',
            description: 'blablabal',
            
            //visibleBy: ['EXTERNAL'],

            elements: [

            ],
        },

        /*layoutPicker: function(data, currentUser) {
            //if (currentUser.email == 'tomaschoff@mebedo-ac.de' && )
            if (data.firma === 'Hallo Welt') 
                return 'default';

            return 'extern'
        }*/
    },

    actions: {
        neu: {
            isPrimaryAction: true,

            description: 'Neuzugang einer Adresse',
            icon: 'fas fa-plus',
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            onExecute: { redirect: '/records/crm/adressen/new' }
        },
    },

    methods: {
        onBeforeInsert: ({ firma2 }) => {
            /*if ( !firma2 ) {
                return { status: 'abort', messageText: 'Bitte geben Sie einen Wert im Feld Firma2 ein.' }
            }
            
            if ( firma2.toLowerCase() !== 'hallo welt') {
                return { status: 'abort', messageText: 'Im Feld Firma 2 muß der Text "Hallo Welt" stehen.' }
            }

            if (firma2 === 'HALLO welt') {
                firma2 = 'Hallo Welt';
                return { status: 'info', messageText: 'Der Wert im Feld Firma2 wurde automatisch zu "Hallo Welt" korrigiert.' }
            }*/
            

            return { status: 'okay' };
        },

        onAfterInsert: values => {

            //CoreApi.SendMail (
                
            //)
        },

        onAfterUpdate: (values, { _id }) => {
            // update der Adressen title und ImageUrl an verwandten stellen
            const Kontakte = getModuleStore('kontakte');

            const { title, logoUri, firma1, strasse, plz, ort } = values;

            Kontakte.update({
                'adresse._id': _id
            }, {
                $set: {
                    'adresse.$.title': title,
                    'adresse.$.description': firma1 + ' • ' + strasse + ' • ' + plz + ' ' + ort,
                    'adresse.$.imageUrl': logoUri,
                }
            }, { multi: true });

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
                        WidgetAnzahlKunden,
                        WidgetAnzahlHotels,
                        WidgetAnzahlInteressenten,
                        WidgetAnzahlPartner
                    ]
                },
                {
                    elements: [
                        ChartKontakteProAdresseBar,
                        ChartKontakteProAdresseLine
                    ]
                },
            ]
        },

        extern: {

        },
    },

    reports: [
        ReportAdressenByKundenart,
        ReportAnzahlAdressenByKundenart,
        ReportKontakteProAdresse,
        ReportKontakteByAdresse,
        StaticReportKontakteByAdresse
    ]
}