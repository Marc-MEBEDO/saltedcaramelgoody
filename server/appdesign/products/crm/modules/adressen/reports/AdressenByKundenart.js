import { check } from 'meteor/check';

import { getModuleStore } from "../../../../../../../imports/coreapi";

export const ReportAdressenByKundenart = {
    _id: 'AdressenByKundenart',
    
    title: 'Adressen gem. Kundenart',
    description: 'Zeigt die Adressen, die der angegebenen Kundenart entspricht.',

    sharedWith: [],
    sharedWithRoles: ['EVERYBODY'],

    datasource: ({ kundenart }) => {
        check(kundenart, String);

        const Adressen = getModuleStore('adressen');
        
        const data = Adressen.find({ kundenart }).fetch();

        return {
            data
        };
    }
}