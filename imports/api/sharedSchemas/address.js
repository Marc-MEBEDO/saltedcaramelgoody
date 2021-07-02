import SimpleSchema from 'simpl-schema';

export const AddressSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Firma'
    },
    street: {
        type: String,
        label: 'Straße'
    },
    postalCode: {
        type: String,
        min: 5,
        max: 5
    },
    city: {
        type: String,
        max: 100
    }
});