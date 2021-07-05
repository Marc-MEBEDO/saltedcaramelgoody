import { Adressen } from './modules/adressen';
import { Kontakte } from "./modules/kontakte";

export const Crm = { 
    _id: "crm", 
    title: "CRM", 
    description: "Alle Daten und Funktionen zu unseren Kunden, Interessenten und Ansprechpartner allgemein.", 
    faIconName: 'fa-fw far fa-address-card',

    modules: [
        Adressen,
        Kontakte
    ]
};