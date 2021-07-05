import { OpinionDetails } from '/imports/api/collections/opinionDetails';

/*const checkChildrenRecursive = (id, by, property, propertyBy) => {
    OpinionDetails.find({
        $and: [
            { refParentDetail: id },
            { 
                $or: [
                    { [property]: false },
                    { [property]: { $exists: false } }
                ]
            }
        ]
    }, { fields: { _id: 1 }}).fetch().map( detail => detail._id ).forEach( id => {
        checkChildrenRecursive(id, by, property, propertyBy)

        OpinionDetails.update({
            _id: id
        }, {
            $set: {
                [property]: true,
                [propertyBy]: by
            }
        })
        
        console.log(property, 'Property must set to True for', id, 'by', by)
    });
}

console.log('check OpinionDetails collection > deleted property recursive...');

OpinionDetails.find({
    deleted: true
}, { fields: { _id: 1 }}).fetch().map( detail => detail._id ).forEach( id => {
    checkChildrenRecursive(id, id, 'deleted', 'deletedBy')
});
console.log('Done.');

console.log('check OpinionDetails collection > finallyRemoved property recursive...');

OpinionDetails.find({
    finallyRemoved: true
}, { fields: { _id: 1 }}).fetch().map( detail => detail._id ).forEach( id => {
    checkChildrenRecursive(id, id, 'finallyRemoved', 'finallyRemovedBy')
});
console.log('Done.');*/
