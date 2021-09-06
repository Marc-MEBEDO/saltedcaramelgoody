import { Mongo } from 'meteor/mongo';
import SimpleSchema from  'simpl-schema';

import { SingularPluralSchema } from '../sharedSchemas/singularPlural';

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
    moduleDetails: {
        type: new SimpleSchema({
            productId: { // wird beim Feldtyp Module benötigt
                type: String,
                label: 'Produkt-Id',
            },
            moduleId: { // wird beim Feldtyp Module benötigt
                type: String,
                label: 'Modul-Id',
            },
            hasDescription: {
                type: Boolean
            },
            description: { // JS-Funktion zum rendern der description
                type: String,
                optional: true
            },
            hasImage: {
                type: Boolean
            },
            imageUrl: {
                type: String,
                optional: true
            },
            linkable: {
                type: Boolean
            },
            link: {
                type: String,
                optional: true
            }
        }),
        optional: true
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
    },
    namesAndMessages: {
        type: new SimpleSchema({

            singular: SingularPluralSchema,
            
            plural: SingularPluralSchema,

            messages: new SimpleSchema({
                onUpdate: {
                    type: String,
                    optional: true
                },
            })
        }),
        label: 'Namen und Meldungstexte'
    }
});