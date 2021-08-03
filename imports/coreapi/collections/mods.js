import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

import { SharedWithSchema } from '../sharedSchemas/user';

import SimpleSchema from  'simpl-schema';

import { getModuleStore } from '..';
import { Activities } from './activities';

import { injectUserData } from './../helpers/roles';

const SingularPluralSchema = new SimpleSchema({
    mitArtikel: {
        type: String
    },
    ohneArtikel: {
        type: String
    },
}); 

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
    namesAndMessages: {
        type: new SimpleSchema({

            singular: SingularPluralSchema,
            
            plural: SingularPluralSchema,

            messages: new SimpleSchema({
                activityRecordInserted: {
                    type: String,
                    optional: true
                },
                activityRecordUpdated: {
                    type: String,
                    optional: true
                },
                activityRecordRemoved: {
                    type: String,
                    optional: true
                }
            })
        }),
        label: 'Namen und Meldungstexte'
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
        const currentUser = Meteor.users.findOne(this.userId);

        if (!currentUser) {
            return { status: 'critical', messageText: 'Sie sind nicht am System angemeldet' }
        }

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

        const moduleStore = getModuleStore(moduleId);
        
        let recordId = null;

        try {
            // insert data to store
            recordId = moduleStore.insert(injectUserData({currentUser}, values));
            
            // Insert into activities log
            Activities.insert(
                injectUserData({ currentUser }, {
                    productId,
                    moduleId,
                    recordId,
                    type: 'SYSTEM-LOG',
                    action: 'INSERT',
                    message: mod.namesAndMessages.messages.activityRecordInserted || `hat ${mod.namesAndMessages.singular.mitArtikel} erstellt`
                }, { created: true })
            );
        } catch(err) {
            return { status: 'critical', messageText: 'Fehler beim insert der Daten oder Activity\n' + err.message };
        }

        return { 
            status: 'okay', 
            messageText: `${mod.namesAndMessages.singular.mitArtikel} wurde erfolgreich gespeichert.`, 
            recordId
        };
    }
});