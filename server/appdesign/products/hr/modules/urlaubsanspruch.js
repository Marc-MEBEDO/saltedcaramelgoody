import { defaultSecurityLevel } from './../../../security';
import { ctStringInput, ctCollapsible, ctInlineControls, ctDateInput } from '../../../../../imports/coreapi/controltypes';

import { FieldNamesAndMessages } from '../../../../coreapi';

export const Urlaubsanspruch = { 
    _id: "urlaubsanspruch",

    title: "Urlaubsanspruch",
    description: "Verwaltung der einzelnen Urlaubsansprüche aller Mitarbeiter.",
    faIconName: 'fa-fw fas fa-globe',
    
    namesAndMessages: {
        singular: { mitArtikel: 'der Urlaubsanspruch', ohneArtikel: 'Urlaubsanspruch' },
        plural: { mitArtikel: 'die Urlaubsansprüche', ohneArtikel: 'Urlaubsansprüche' },

        // wenn vorhanden, dann wird die Message genutzt - ansonsten wird
        // die Msg generisch mit singular oder plural generiert
        messages: {

        }
    },

    fields: {
        title: { type: 'String', ...FieldNamesAndMessages('der', 'Titel', 'die', 'Titel', { onChange: 'den Titel'}), ...defaultSecurityLevel },
        datumVon: { type: 'String', ...FieldNamesAndMessages('das', 'Datum (von)', 'das', 'Datum (von)'), ...defaultSecurityLevel },
        datumBis: { type: 'String', ...FieldNamesAndMessages('das', 'Datum (bis)', 'das', 'Datum (bis)'), ...defaultSecurityLevel },
        urlaubsanspruch: { type: 'String', ...FieldNamesAndMessages('der', 'Urlaubsanspruch', 'die', 'Urlaubsansprüche', { onChange: 'den Urlaubsanspruch'}), ...defaultSecurityLevel },
    },

    actions: {
        neu: {
            isPrimaryAction: true,

            description: 'Neuzugang von Urlaubsanspruch',
            icon: 'fas fa-plus',
            
            visibleBy: [ 'ADMIN', 'EMPLOYEE' ],
            executeBy: [ 'ADMIN', 'EMPLOYEE' ],

            onExecute: { redirect: '/records/hr/urlaubsanspruch/new' }
        },
    },

    layouts: {
        default: {
            title: 'Standard-layout',
            description: 'dies ist ein universelles Layout für alle Operationen',
            
            elements: [
                { field: 'title', controlType: ctStringInput },
                { title: 'Gültigkeit', controlType: ctCollapsible, collapsedByDefault: true, elements: [
                    { field: 'datumVon', controlType: ctDateInput },
                    { field: 'datumBis', controlType: ctDateInput },
                ]}
            ]
        }
    },
};
