import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

import { SharedWithSchema } from '../sharedSchemas/user';

import SimpleSchema from  'simpl-schema';

import { getModuleStore } from '..';
import { Activities } from './activities';
import { determineChanges } from '../helpers/activities';

import { injectUserData } from './../helpers/roles';

import { SingularPluralSchema } from '../sharedSchemas/singularPlural';

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
            defaults: {
                type: String,
                label: 'Defaultsdefinition',
                optional: true
            },
            onBeforeInsert: {
                type: String,
                label: 'Before Insert Hook',
                optional: true
            },
            onAfterInsert: {
                type: String,
                label: 'Before Insert Hook',
                optional: true
            },
            onBeforeUpdate: {
                type: String,
                label: 'Before Insert Hook',
                optional: true
            },
            onAfterUpdate: {
                type: String,
                label: 'Before Insert Hook',
                optional: true
            },
            onBeforeRemove: {
                type: String,
                label: 'Before Insert Hook',
                optional: true
            },
            onAfterRemove: {
                type: String,
                label: 'Before Insert Hook',
                optional: true
            }
        }),

        label: 'Methoden',
        optional: true
    },
    dashboards: {
        type: Object,
        label: 'Dashboards',
        optional: true,
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


Meteor.methods({
    'modules.insertRecord'({ productId, moduleId, values }){
        check(productId, String);
        check(moduleId, String);
        check(values, Object);

        const currentUser = Meteor.users.findOne(this.userId);

        if (!currentUser) {
            return { status: 'critical', messageText: 'Sie sind nicht am System angemeldet' }
        }

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

        // TODO:validate data fehlt noch...

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
    },

    /**
     * Aktualisieren eines Records
     * 
     * @param {Object} param0 { productId, moduleId, recordId, values }
     * @returns 
     */
    'modules.updateRecord'({ productId, moduleId, recordId, values }){
        check(productId, String);
        check(moduleId, String);
        check(recordId, String);
        check(values, Object);

        const currentUser = Meteor.users.findOne(this.userId);
        if (!currentUser) {
            return { status: 'critical', messageText: 'Sie sind nicht am System angemeldet' }
        }


        const moduleStore = getModuleStore(moduleId);
        
        const oldValues = moduleStore.findOne({
            $and: [
                { _id: recordId },
                {
                    $or: [
                        { "sharedWith.user.userId": currentUser._id },
                        { sharedWithRoles: { $in: currentUser.userData.roles } }
                    ]
                }
            ]
        });

        /*
            prüfen, ob ein Record zurückgeliefert wurde. Falls dem nicht so ist, hat dies
            folgende Gründe:
            - recordID ist falsch
            - Record wurde nicht mit dem benutzer explizit geteilt
            - Benutzer hat nicht die entsprechende Rolle (geteilt)
        */
       if (!oldValues) {
        return { status: 'critical', messageText: 'Der Datensatz exisitiert nicht oder wurde nicht mit Ihnen geteilt.' }
       }

        const mod = Mods.findOne(moduleId);
        if (!mod) {
            return { status: 'critical', messageText: 'Das angegebene Modul zum Datensatz konnte nicht gefunden werden.' }
        }

        if (mod.methods && mod.methods.onBeforeUpdate) {
            let result;
            beforeUpdateHook = eval(mod.methods.onBeforeUpdate);
            
            try {
                result = beforeUpdateHook(values, oldValues);
            } catch(err) {
                return { status: 'critical', messageText: err.message }
            }

            if (result.status === 'abort') {
                return { status: result.status, messageText: result.messageText }
            }
        }

        // validate data...
        // TODO ...

        // 
        const changes = determineChanges(mod.fields, values, oldValues);
        if (!changes) {
            return { 
                status: 'info', 
                messageText: `Es wurden keine Änderungen durchgeführt.`,
                recordId
            };
        }

        try {
            // Insert into activities log
            Activities.insert(
                injectUserData({ currentUser }, {
                    productId,
                    moduleId,
                    recordId,
                    type: 'SYSTEM-LOG',
                    action: 'UPDATE',
                    ...changes,
                }, { created: true })
            );

            // update data in store
            moduleStore.update(recordId, {
                $set: values
            });
            
            if (mod.methods && mod.methods.onAfterUpdate) {
                let result;
                afterUpdateHook = eval(mod.methods.onAfterUpdate);

                try {
                    result = afterUpdateHook(values, oldValues);
                } catch(err) {
                    return { status: 'critical', messageText: 'Fehler bei der Ausführung "onAfterUpdate":' + err.message }
                }
    
                if (result.status === 'abort') {
                    return { status: result.status, messageText: result.messageText }
                }
            }

        } catch(err) {
            return { status: 'critical', messageText: 'Fehler beim update der Daten oder Activity\n' + err.message };
        }

        return { 
            status: 'okay', 
            messageText: `${mod.namesAndMessages.singular.mitArtikel} wurde erfolgreich gespeichert.`, 
            recordId
        };
    }
});