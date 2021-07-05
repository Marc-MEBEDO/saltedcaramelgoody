import { Mongo } from 'meteor/mongo';
import SimpleSchema from  'simpl-schema';

export const ActionSchema = new SimpleSchema({
    title: {
        type: String,
        label: 'Feldname',
        optional: true
    },
    description: {
        type: String,
        label: 'Feldname',
        optional: true
    },
    icon: {
        type: String,
        label: 'Symbol'
    },
    isPrimaryAction: {
        type: Boolean,
        label: 'Kennung der Primäraktion',
        optional: true
    },
    onExecute: {
        type: Object
    },
    'onExecute.redirect': {
        type: String,
        optional: true
    },
    visibleBy: {
        type: Array,
        label: 'Sichtbar für'
    },
    'visibleBy.$': {
        type: String
    },
    executeBy: {
        type: Array,
        label: 'Ausführbar durch'
    },
    'executeBy.$': {
        type: String
    }
});