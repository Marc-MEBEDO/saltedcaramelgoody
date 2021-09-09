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
    reportId: { // wird genutzt, wenn controltype = ctReport
        type: String,
        optional: true
    },
    direction: {
        type: 'String', // vertical or horizontal für die Darstellung von Radio Buttons
        optional: true
    },
    values: { // Aulistung von z.B: Optionlist values zur Auswahl im Radio oder Select style, etc
        type: Array, //SimpleSchema.oneOf(String, Array),
        optional: true,
        //custom: () => true
    },
    'values.$': {
        type: new SimpleSchema({
            _id: { type: String },
            title: { type: String },
            color: { type: String, optional: true },
            backgroundColor: { type: String, optional: true }
        }),
    },
    defaultValue: {
        type: String,
        optional: true
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
    },
    columns: { // für controlType ctColumns zur Darstellung von <Rows> <Cols>1</Cols> <Cols>2</Cols> </Rows>
        type: Array,
        optional: true
    },
    'columns.$': {
        type: Object,
        blackbox: true,
    },
    columnDetails: {
        type: new SimpleSchema({
            xs: { type: SimpleSchema.Integer, optional: true },
            sm: { type: SimpleSchema.Integer, optional: true },
            md: { type: SimpleSchema.Integer, optional: true },
            lg: { type: SimpleSchema.Integer, optional: true },
            xl: { type: SimpleSchema.Integer, optional: true },
        }),
        optional: true
    },
    googleMapDetails: { // wird benötigt bei controltype GoogleMaps
        type: new SimpleSchema({
            location: { type: String } // Funktion, welche den Location-string setzt als return-wert
        }),
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