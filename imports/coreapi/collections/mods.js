import { Mongo } from 'meteor/mongo';
import { SharedWithSchema } from '../sharedSchemas/user';

import SimpleSchema from  'simpl-schema';


export const ModuleSchema = new SimpleSchema({
    productId: {
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
    position: {
        type: SimpleSchema.Integer,
        label: 'Anzeigeposition'
    },
    faIconName: {
        type: String,
        label: 'Symbol',
        optional: true
    },
    isSeparator: {
        type: Boolean,
        optional: true
    },
    fields: {
        type: Object,
        label: 'Felder',
        blackbox: true
    },
    actions: {
        type: Object,
        label: 'Aktionen',
        blackbox: true
    },
    layouts: {
        type: Object,
        label: 'Layouts',
        blackbox: true
    }
});

ModuleSchema.extend(SharedWithSchema);

export const Mods = new Mongo.Collection('modules');
Mods.attachSchema(ModuleSchema);

Mods.allow ({
    insert() { return false; },
    update() { return false; },
    remove() { return false; },
});