import { ReportAnzahlAdressenByKundenart } from '../reports/AnzahlAdressenByKundenart';

export const WidgetAnzahlPartner = {
    _id: 'AnzahlPartner',
    type: 'widget', 
    
    label: 'Anzahl Partner', 
    icon: 'fas fa-handshake', 
    color: 'lightblue', 
    
    static: true, 
    report: ReportAnzahlAdressenByKundenart,
    params: {
        kundenart: 'partner'
    },
    
    width: { xs:24, sm:24, md:12, lg:6, xl:6 },
    
    onClick: { redirect: '/reports/crm/adressen/AdressenByKundenart?kundenart=hotel' }
}