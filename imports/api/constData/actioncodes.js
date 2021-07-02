export const actionCodes = {
    adhoc: { color: 'red', text: 'Ad hoc', longtext: 'Es sind Ad-Hoc Maßnahmen notwendig!', orderId: 1 },
    kurz: { color: 'orange', text: 'kurzfristige Maßnahme', longtext: 'Es besteht dringender Handlungsbedarf.', orderId: 2 },
    mittel: { color: '#bfbf17', text: 'mittelfristige Maßnahme', longtext: 'Es besteht Handlungsbedarf.', orderId: 3 },
    verbesserung: { color: 'green', text: 'Verbesserungsvorschlag', longtext: 'Es besteht Verbesserungsbedarf.', orderId: 4 },
    okay: { color: 'lightgrey', text: 'Kein Handlungsbedarf', longtext: 'Es besteht derzeit kein Handlungsbedarf.', orderId: 5 },

    unset: { color: 'black', text: 'noch nicht bewertet', longtext: 'Aktuell noch nicht bewertet.', orderId: 6 }
}