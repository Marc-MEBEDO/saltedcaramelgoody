import { Layouttypes } from '/imports/api/collections/layouttypes';
import { layouttypesObject } from '/imports/api/constData/layouttypes';

//if (Layouttypes.find().count() != 0) {
    Layouttypes.remove({});

    lt = Object.keys(layouttypesObject);
    lt.forEach( key => {
        if (layouttypesObject[key].internalUseOnly) return;
        Layouttypes.insert(layouttypesObject[key]);
    });
//}