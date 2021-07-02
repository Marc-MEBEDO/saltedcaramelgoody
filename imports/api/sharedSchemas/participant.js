import SimpleSchema from 'simpl-schema';

export const ParticipantSchema = new SimpleSchema({
    id: {
        type: String
    },
    gender: {
        type: String,
        label: 'Anrede',
        allowedValues: ['Herr', 'Frau', 'Divers']
    },
    academicTitle: {
        type: String,
        label: 'Titel',
        optional: true
    },
    firstName: {
        type: String,
        label: 'Vorname',
        optional: true
    },
    lastName: {
        type: String,
        label: 'Nachname'
    },
    position: {
        type: String,
        label: 'Position',
        optional: true
    },
    comment: {
        type: String,
        label: 'Kommentar',
        optional: true
    }
});