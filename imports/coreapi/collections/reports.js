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
    datasource: {
        type: String
    },
    additionalData: {
        type: Object,
        optional: true,
        blackbox: true
    },
    type: {
        type: String,
        optional: true
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
