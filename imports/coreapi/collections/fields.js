import { Mongo } from 'meteor/mongo';
import SimpleSchema from  'simpl-schema';

export const FieldSchema = new SimpleSchema({
    title: {
        type: String,
        label: 'Feldname',
        optional: true
    },
    type: {
        type: String,
        label: 'Feldtyp'
    },
    maxLength: {
        type: SimpleSchema.Integer,
        label: 'Feldlänge (String)',
        optional: true,
    },
    maxItems: {
        type: SimpleSchema.Integer,
        label: 'Max Einträge für Type Array',
        optional: true,
    },
    rules: {
        type: Array,
        label: 'Regeln',
        optional: true
    },
    'rules.$': {
        type: Object,
        label: 'Regeldefinition',
        blackbox: true
    },
    visibleBy: {
        type: Array,
        label: 'Sichtbar für'
    },
    'visibleBy.$': {
        type: String
    },
    editableBy: {
        type: Array,
        label: 'Bearbeitbar für'
    },
    'editableBy.$': {
        type: String
    }
});