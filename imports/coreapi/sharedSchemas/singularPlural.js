import SimpleSchema from  'simpl-schema';

export const SingularPluralSchema = new SimpleSchema({
    mitArtikel: {
        type: String
    },
    ohneArtikel: {
        type: String
    },
}); 