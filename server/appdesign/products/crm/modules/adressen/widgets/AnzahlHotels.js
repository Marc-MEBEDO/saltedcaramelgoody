import { ReportAnzahlAdressenByKundenart } from '../reports/AnzahlAdressenByKundenart';

export const WidgetAnzahlHotels = {
    _id: 'AnzahlHotels',
    type: 'widget', 
    
    label: 'Anzahl Hotels', 
    icon: 'fas fa-bed',
    color: 'orange', 
    
    static: true, 
    report: ReportAnzahlAdressenByKundenart,
    params: {
        kundenart: 'hotel'
    },
    
    width: { xs:24, sm:24, md:12, lg:6, xl:6 },
    
    onClick: { redirect: '/reports/crm/adressen/AdressenByKundenart?kundenart=hotel' }
}