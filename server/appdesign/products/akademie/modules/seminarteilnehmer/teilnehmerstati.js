import { Colors } from '../../../../../../imports/coreapi/colors';

export const Teilnehmestati = [
    { _id: 'angemeldet', title:'angemeldet', ...Colors.blue }, 
    { _id: 'bestätigt', title:'bestätigt',  ...Colors.orange },
    { _id: 'abgesagt', title:'abgesagt',  ...Colors.red },
    { _id: 'teilgenommen', title:'teilgenommen', ...Colors.green },
    { _id: 'abgerechnet', title: 'abgerechnet', ...Colors.grey },
    { _id: 'angebot', title:'angeboten', ...Colors.cyan }, 
];