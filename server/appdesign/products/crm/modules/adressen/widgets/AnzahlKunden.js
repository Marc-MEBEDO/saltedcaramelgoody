import { ReportAnzahlAdressenByKundenart } from '../reports/AnzahlAdressenByKundenart';

export const WidgetAnzahlKunden = {
    _id: 'AnzahlKunden',
    type: 'widget', 
    
    label: 'Anzahl Kunden', 
    icon: 'far fa-building', 
    color: '#6F4', 
    
    static: true, 
    report: ReportAnzahlAdressenByKundenart, 
    params: {
        kundenart: 'kunde'
    },

    width: { xs:24, sm:24, md:12, lg:6, xl:6 },
    
    onClick: { redirect: '/reports/crm/adressen/AdressenByKundenart?kundenart=kunde' }
}