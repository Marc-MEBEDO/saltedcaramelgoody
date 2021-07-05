import { defaultSecurityLevel } from './../../../security';
import { ctStringInput, ctCollapsible, ctInlineControls, ctDateInput } from '../../../../../imports/coreapi/controltypes';

export const Urlaubsanspruch = { 
    _id: "urlaubsanspruch",

    title: "Urlaubsanspruch",
    description: "Verwaltung der einzelnen Urlaubsansprüche aller Mitarbeiter.",
    faIconName: 'fa-fw fas fa-globe',

    fields: {
        title: { type: 'String', maxLength: 200, ...defaultSecurityLevel },
        datumVon: { type: 'String', maxLength: 12, ...defaultSecurityLevel },
        datumBis: { type: 'String', maxLength: 12, ...defaultSecurityLevel },
        urlaubsanspruch: { type: 'String', maxLength: 12, ...defaultSecurityLevel },
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