import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

import { SharedWithSchema } from '../sharedSchemas/user';

import SimpleSchema from  'simpl-schema';

import { moduleStores } from '..';

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
    },
    methods: {
        type: new SimpleSchema({
            onBeforeInsert: {
                type: String,
                label: 'Before Insert Hook',
                optional: true
            }
        }),
        label: 'Methoden',
        optional: true
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


Meteor.methods({
    'modules.insertRecord'({ productId, moduleId, values }){
        check(productId, String);
        check(moduleId, String);
        check(values, Object);

        const mod = Mods.findOne(moduleId);
        
        if (mod.methods && mod.methods.onBeforeInsert) {
            let result;
            beforeInsertHook = eval(mod.methods.onBeforeInsert);
            
            try {
                result = beforeInsertHook(values);
            } catch(err) {
                return { status: 'critical', messageText: err.message }
            }

            if (result.status === 'abort') {
                return { status: result.status, messageText: result.messageText }
            }
        }

        // validate data...
        

        let moduleStore = moduleStores[moduleId];
        
        if (!moduleStore) {
            moduleStores[moduleId] = new Mongo.Collection(moduleId);
            moduleStore = moduleStores[moduleId];
        }
        
        // insert data to store
        moduleStore.insert(values);

        return { status: 'okay' };
    }
});