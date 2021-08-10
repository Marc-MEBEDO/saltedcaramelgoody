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
    datasource: {
        type: String
    },
});

ReportSchema.extend(SharedWithSchema);

export const Reports = new Mongo.Collection('reports');
Reports.attachSchema(ReportSchema);

Reports.allow ({
    insert() { return false; },
    update() { return false; },
    remove() { return false; },
});
