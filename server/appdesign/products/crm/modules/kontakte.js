import { defaultSecurityLevel } from './../../../security';

export const Kontakte = { 
    _id: "kontakte",

    title: "Kontakte",
    description: "Alle Kontakte, die von uns benötigt werden.",
    faIconName: 'fa-fw far fa-address-card',
    
    namesAndMessages: {
        singular: { mitArtikel: 'der Kontakt', ohneArtikel: 'Kontakt' },
        plural: { mitArtikel: 'die Kontakte', ohneArtikel: 'Kontakte' },

        // wenn vorhanden, dann wird die Message genutzt - ansonsten wird
        // die Msg generisch mit singular oder plural generiert
        messages: {

        }
    },

    fields: {
        title: { type: 'String', ...defaultSecurityLevel },
    },

    actions: {

    },

    layouts: {

    }
};
