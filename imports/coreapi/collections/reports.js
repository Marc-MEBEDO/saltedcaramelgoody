import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

import { SharedWithSchema } from '../sharedSchemas/user';

import SimpleSchema from  'simpl-schema';

import { getModuleStore } from '..';
import { Activities } from './activities';

import { injectUserData } from './../helpers/roles';

export const ReportSchema = new SimpleSchema({
    productId: {
        type: String,
        label: 'Produkt-Id',
    },
    moduleId: {
        type: String,
        label: 'Produkt-Id',
    },
    title: {
        type: String,
        label: 'Titel',
        max: 100,
    },
    description: {
        type: String,
        label: 'Beschreibung'
    },
    faIconName: {
        type: String,
        label: 'Symbol',
        optional: true
    },
    columns: {
        type: Array,
        optional: true,
    },
    'columns.$': {
        type: new SimpleSchema({
            key: { type: String },
            dataIndex: { type: String },
            title: { type: String },
            render: { type: String, optional: true }
        })
    },
    datasource: { // datasource für static reports
        type: String,
        optional: true
    },
    liveData: { // datasource für realtime
        type: String,
        optional: true
    },
    isStatic: {
        type: Boolean,
        defaultValue: true,
        optional: true
    },
    additionalData: {
        type: Object,
        optional: true,
        blackbox: true
    },
    type: {
        type: String,
        optional: true
    },
    actions: {
        type: Array,
        optional: true
    },
    'actions.$': {
        type: new SimpleSchema({
            title: {
                type: String,
                label: 'Titel',
                max: 100,
            },
            description: {
                type: String,
                label: 'Beschreibung'
            },
            icon: {
                type: String,
                label: 'Symbol',
                optional: true
            },
            iconOnly: { // wenn true, dann wird nur das Icon ohne title angezeigt
                type: Boolean,
                defaultValue: false
            },
            inGeneral: { 
                // gibt an, ob die Action z.B. Neuzugang als alg. Aktion überhalb des Reports dargestelt wird
                // oder für jeden einzelnen Datensatz angeboten wird
                type: Boolean,
                defaultValue: false
            },
            type: {
                // gibt an, ob dies die "Haut"Aktion ist. Diese wird im rendering direkt dargestellt und hervorgehben
                type: String, // primary, secondary, more
                defaultValue: 'more'
            },
            visibleBy: {
                type: Array
            },
            'visibleBy.$': {
                type: String
            },
            executeBy: {
                type: Array
            },
            'executeBy.$': {
                type: String
            },
            disabled: { // Funktion, die prüft ob die Action deaktiviert werde soll oder nicht
                type: String,
                optional: true
            },
            visible: { // Funktion, die prüft ob die Action angezeigt werde soll oder nicht
                type: String,
                optional: true
            },
            onExecute: {
                type: new SimpleSchema({
                    redirect: {
                        type: String,
                        optional: true
                    },
                    exportToCSV: {
                        type: new SimpleSchema({
                            filename: { type: String }
                        }),
                        optional: true
                    },
                    runScript: { // Funktion, die als methode für Server und client registriert wird
                        type: String,
                        optional: true
                    }
                })
            }
        })
    }
});

ReportSchema.extend(SharedWithSchema);

export const Reports = new Mongo.Collection('reports');
Reports.attachSchema(ReportSchema);

Reports.allow ({
    insert() { return false; },
    update() { return false; },
    remove() { return false; },
});
