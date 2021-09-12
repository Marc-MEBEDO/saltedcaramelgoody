import { registerApplication } from '../coreapi';

import { Crm } from './products/crm';
import { Beratung } from './products/beratung';
import { Hr } from './products/hr';
import { Akademie } from './products/akademie';

const Application = {
    _id: 'mebedo.world',

    title: 'MEBEDO.world',
    description: 'Alles was wir innerhalb der MEBEDO zum leben und arbeiten benötigen.',

    products: [
        Hr,
        Crm,
        Beratung,
        Akademie,
    ]
}

registerApplication (Application);