import { Mongo } from 'meteor/mongo';
import SimpleSchema from  'simpl-schema';

export const RolesSchema = new SimpleSchema({
    rolename: {
        type: String,
        label: 'Rollenname'
    },
    description: {
        type: String,
        label: 'Beschreibung'
    },
    selectable: {
        type: Boolean,
        label: 'Auswählbar durch Benutzer',
        defaultValue: true
    },
    score: {
        type: SimpleSchema.Integer, 
        label: 'Wertigkeit der ROlle im Vergleich zu allen anderen Rollen. Je höher der Score desto wertiger die Rolle.',
        defaultValue: 0
    },
    invitableRoles: {
        label: 'Einladbare Rollen',
        type: Array
    },
    'invitableRoles.$': {
        label: 'Einladbare Rolle',
        type: new SimpleSchema({
            roleId: {
                type: String
            },
            displayName: {
                type: String
            }
        })
    },
    permissions: {
        label: 'Berechtigungen',
        type: new SimpleSchema({
            shareWith: {
                type: SimpleSchema.Integer,
                label: 'Darf Dinge teilen',
                defaultValue: 0
            },
            cancelSharedWith: {
                type: SimpleSchema.Integer,
                label: 'Darf Teilen rückgängig machen bzw. eine Person "entfernen"',
                defaultValue: 0
            },
            manageUsersAndRoles: {
                type: SimpleSchema.Integer,
                label: 'Darf Benutzer und Rollen verwalten',
                defaultValue: 0
            },
        }),
    }
});

export const Roles = new Mongo.Collection('roles');
Roles.attachSchema(RolesSchema);