import { getModuleStore } from "../../../../../../../imports/coreapi";

export const ReportKontakteProAdresse = {
    _id: 'KontakteProAdresse',
    
    type: 'chart',
    //typedetail:'pie',

    title: 'Anzahl Kontakte pro Adresse',
    description: 'Zeigt die Anzahl der Kontakte der jeweiligen Adresse an.',

    sharedWith: [],
    sharedWithRoles: ['EVERYBODY'],

    datasource: () => {
        const Adressen = getModuleStore('adressen');

        let data = {
            labels: [],
            datasets: []
        }

        const rawData = Adressen.find({}, { fields: { title: 1 }, sort: { createdAt: -1 }, limit: 10 }).fetch();
        data.labels = rawData.map( d => d.title );

        data.datasets = [{
            label: 'Anzahl Kontakte pro Adresse (=> Aktuell Anzahl Zeichen des Titels)',
            data: rawData.map( d => d.title.length ),
            backgroundColor: [
                'palegreen',
                'orange',
                '#7093db',
                '#6484c5',
                '#5975af',
                '#4e6699',
                '#435883',
                '#38496d',
                '#2c3a57',
                '#212c41'
            ],
        }];
        return data;
    }
}

const _ChartKontakteProAdresse = {
    type: 'chart',
    
    label: 'Kontakte pro Adresse', 
    
    static: true, 
    report: ReportKontakteProAdresse,

    width: { xs:24, sm:24, md:24, lg:12, xl:12 },
    
    //onClick: { redirect: '/reports/crm/adressen/KontakteProAdresse' }
}

export const ChartKontakteProAdresseBar = {
    ..._ChartKontakteProAdresse,
    _id: 'ChartKontakteProAdresseBar',
    typedetail: 'Bar',
    onClick: { redirect: '/reports/crm/adressen/KontakteProAdresse?typedetail=bar' }
}

export const ChartKontakteProAdresseLine = {
    ..._ChartKontakteProAdresse,
    _id: 'ChartKontakteProAdresseLine',
    typedetail: 'Line',
    onClick: { redirect: '/reports/crm/adressen/KontakteProAdresse?typedetail=line' }
}