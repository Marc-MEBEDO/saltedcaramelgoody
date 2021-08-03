const sharedReportKunden = {
    label: 'Kunden',
    columns: [ 
        'title', 
        { firma: doc => { return doc.firma1 } }, 
        { strasse: 'Straße' },
        { plz: { label: 'Postleitzahl', value: doc => doc.countryCode +'-' + doc.plz }}
    ],
}

export const ReportKundenRealtime = {
    _id: 'ReportKundenRealtime', 
    type: 'report', ...sharedReportKunden,
    datasourceClient: (Adressen, additionalClientData) => {
        return Adressen.find({ projectId: additionalClientData._id }).fetch();
    },
    datasourceServer: (Adressen, additionalClientData) => {
        return Adressen.find({ projectId: additionalClientData._id });
    },
}

export const ReportKundenStatic = {
    _id: 'ReportKundenStatic', 
    type: 'static-report', ...sharedReportKunden,
    datasource: Adressen => {
        return Adressen.find({}).fetch();
    }, 
}