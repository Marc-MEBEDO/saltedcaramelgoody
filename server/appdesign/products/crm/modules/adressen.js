import { defaultSecurityLevel } from './../../../security';

import { ctStringInput, ctCollapsible, ctInlineCombination } from '../../../../../imports/coreapi/controltypes';

export const Adressen = {
    _id: "adressen",

    title: "Adressen", 
    description: "Alle Adressen, die von uns benötigt werden.", 
    faIconName: 'fa-fw far fa-building',

    fields: {
        title: { type: 'String', rules: [
            { required: true, message: 'Bitte geben Sie den Titel der Adresse ein.' },    
        ] , ...defaultSecurityLevel },

        firma1: { type: 'String', rules: [
            { required: true, message: 'Bitte geben Sie den Firmennamen ein.' },
            { min: 3, message: 'Bitte geben Sie mindestens 3 Zeichen für den Firmennamen ein.' },
            { max: 50, message: 'Bitte geben Sie maximal 50 Zeichen für den Firmenname ein.' },
        ] , ...defaultSecurityLevel },

        firma2: { type: 'String', rules: [
            { max: 50, message: 'Bitte geben Sie maximal 50 Zeichen für den Firmenzusatz (2) ein.' },
        ] , ...defaultSecurityLevel },
        firma3: { type: 'String', rules: [
            { max: 50, message: 'Bitte geben Sie maximal 50 Zeichen für den Firmenzusatz (3) ein.' },
            { 
                customValidator: ({ getFieldValue }) => ({
                    validator(_, value) {
                        const firma1 = getFieldValue('firma1');

                        if (!value || firma1 === value || firma1 === 'Hallo Welt') {
                            return Promise.resolve();
                        }

                        return Promise.reject(new Error('Bitte geben den Wert "' + firma1 + '" erneut ein.'));
                    },
                }),
            }
        ] , ...defaultSecurityLevel },

        strasse: { type: 'String', ...defaultSecurityLevel },
        plz: { title: 'PLZ', type: 'String', ...defaultSecurityLevel },
        ort: { type: 'String', ...defaultSecurityLevel },

        firmaRechnung: { title: 'Firma', type: 'ArrayOfStrings', ...defaultSecurityLevel },
        strasseRechnung: { title: 'Straße', type: 'String', ...defaultSecurityLevel },
        plzRechnung: { title: 'PLZ', type: 'String', ...defaultSecurityLevel },
        ortRechnung: { title: 'Ort', type: 'String', ...defaultSecurityLevel },

        eMailRechnung: { title: 'E-Mailadresse für Rechnungsversandt', type: 'String', ...defaultSecurityLevel },

        telefon: { type: 'String', ...defaultSecurityLevel },
        telefax: { type: 'String', ...defaultSecurityLevel },
        website: { type: 'String', ...defaultSecurityLevel },
        email: { type: 'String', ...defaultSecurityLevel },
        
        haarfarbe: { type: 'String', ...defaultSecurityLevel },
    },

    layouts: {
        default: {
            title: 'Standard-layout',
            description: 'dies ist ein universallayout für alle Operationen',

            //visibleBy: ['EMPLOYEE'],
            
            elements: [
                { field: 'title', controlType: ctStringInput },
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
                    {  field: 'haarfarbe',  controlType: ctStringInput },
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
            if ( !firma2 ) {
                return { status: 'abort', messageText: 'Bitte geben Sie einen Wert im Feld Firma2 ein.' }
            }
            
            if ( firma2.toLowerCase() !== 'hallo welt') {
                return { status: 'abort', messageText: 'Im Feld Firma 2 muß der Text "Hallo Welt" stehen.' }
            }

            if (firma2 === 'HALLO welt') {
                firma2 = 'Hallo Welt';
                return { status: 'info', messageText: 'Der Wert im Feld Firma2 wurde automatisch zu "Hallo Welt" korrigiert.' }
            }
            

            return { status: 'okay' };
        },

        onAfterInsert: values => {

            CoreApi.SendMail (
                
            )
        }
    }
}