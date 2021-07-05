import { Mongo } from 'meteor/mongo';
import SimpleSchema from  'simpl-schema';

export const LayoutElementsSchema = new SimpleSchema({
    field: {
        type: String,
        optional: true
    },
    title: {
        type: String,
        optional: true
    },
    noTitle: { // wenn true gesetzt ist bedeutet dies, dass kein Label im Form dargestellt wird
        type: Boolean,
        optional: true
    },
    controlType: {
        type: String
    },
    collapsedByDefault: {
        type: Boolean,
        optional: true
    },
    elements: {
        type: Array,
        optional: true
    },
    'elements.$': {
        type: Object, //LayoutElementsSchema,
        blackbox: true,
        optional: true
    }
});


export const LayoutSchema = new SimpleSchema({
    title: {
        type: String,
        label: 'Layouttitel',
        optional: true
    },
    description: {
        type: String,
        label: 'Beschreibung'
    },
    elements: {
        type: Array,
        label: 'Elementauflistung',
    },
    'elements.$': {
        type: LayoutElementsSchema
    },
});