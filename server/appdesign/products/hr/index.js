import { Urlaubsanspruch } from './modules/urlaubsanspruch';


export const Hr = { 
    _id: "hr", 
    title: "Human Ressources", 
    description: "Alles relevante für unsere Mitarbeiter", 
    faIconName: 'fa-fw far fa-address-book',

    modules: [
        Urlaubsanspruch
    ]
};