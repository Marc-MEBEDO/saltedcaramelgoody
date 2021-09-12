import { Seminare } from './modules/seminare';
//import { Seminarteilnehmer } from './modules/seminarteilnehmer';

export const Akademie = {
    _id: "akademie",
    title: "Akademie",
    description: "Alles rund um unsere Seminare. Inhouse- oder offene Veranstaltungen und Online-Trainings.",
    faIconName: 'fa-fw fas fa-graduation-cap',

    modules: [
        Seminare,
        //Seminarteilnehmer
    ]
};
