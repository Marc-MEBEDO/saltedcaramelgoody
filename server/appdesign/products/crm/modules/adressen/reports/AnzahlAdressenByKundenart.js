
import { getModuleStore } from "../../../../../../../imports/coreapi";

export const ReportAnzahlAdressenByKundenart = {
    _id: 'AnzahlAdressenByKundenart',
    
    title: 'Anzahl Adressen',
    description: 'Zeigt die Anzahl der Adressen, die der angegebenen Kundenart entspricht.',

    sharedWith: [],
    sharedWithRoles: ['EVERYBODY'],

    datasource: ({ kundenart }) => {
        const Adressen = getModuleStore('adressen');

        if (!kundenart) kundenart = 'hotel';
        

        const anz = Adressen.find({ kundenart }).count();

        return {
            value: anz,
            //color: 'darkgreen',
            //icon: 'far fa-building',
            //label: 'Unsere Kunden'
        };
    }
}