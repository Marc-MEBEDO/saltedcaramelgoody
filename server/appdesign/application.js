import { registerApplication } from '../coreapi';

import { Crm } from './products/crm';
import { Beratung } from './products/beratung';
import { Seminare } from './products/seminare';
import { Hr } from './products/hr';

const Application = {
    _id: 'meinmebedo',

    title: 'MEIN MEBEDO',
    description: 'Alles was wir innerhalb der MEBEDO zum leben und arbeiten benötigen.',

    products: [
        Hr,
        Crm,
        Beratung,
        Seminare,
    ]
}

registerApplication (Application);