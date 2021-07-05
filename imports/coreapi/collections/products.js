import { Mongo } from 'meteor/mongo';
import { SharedWithSchema } from '../sharedSchemas/user';

import SimpleSchema from  'simpl-schema';


export const ProductSchema = new SimpleSchema({
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
    }
});

ProductSchema.extend(SharedWithSchema);

export const Products = new Mongo.Collection('products');
Products.attachSchema(ProductSchema);

Products.allow ({
    insert() { return false; },
    update() { return false; },
    remove() { return false; },
});