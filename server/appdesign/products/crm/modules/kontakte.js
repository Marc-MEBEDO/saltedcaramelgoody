import { defaultSecurityLevel } from './../../../security';

export const Kontakte = { 
    _id: "kontakte",

    title: "Kontakte",
    description: "Alle Kontakte, die von uns benötigt werden.",
    faIconName: 'fa-fw far fa-address-card',

    fields: {
        title: { type: 'String', ...defaultSecurityLevel },
    },

    actions: {

    },

    layouts: {

    }
};