import { ReportAnzahlAdressenByKundenart } from '../reports/AnzahlAdressenByKundenart';

export const WidgetAnzahlInteressenten = {
    _id: 'AnzahlInteressenten',
    type: 'widget', 
    
    label: 'Anzahl Interessenten', 
    icon: 'fas fa-city', 
    color: 'darkgreen', 
    
    static: true, 
    report: ReportAnzahlAdressenByKundenart,
    params: {
        kundenart: 'interessent'
    },
    
    width: { xs:24, sm:24, md:12, lg:6, xl:6 },
    
    onClick: { redirect: '/reports/crm/adressen/AdressenByKundenart?kundenart=interessent' }
}