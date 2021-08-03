import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Mods } from '/imports/coreapi/collections/mods';
import { getModuleStore } from '../../imports/coreapi';

Meteor.publish('record', function publishRecord({productId, moduleId, recordId}) {
    if (!productId || !moduleId || !recordId)
        return;

    check(productId, String);
    check(moduleId, String);
    check(recordId, String);

    const currentUser = Meteor.users.findOne(this.userId);

    if (!currentUser)
        return;

    const moduleStore = getModuleStore(moduleId);

    return moduleStore.find({
        $and: [
            { _id: recordId },
            {
                $or: [
                    { "sharedWith.user.userId": currentUser._id },
                    { sharedWithRoles: { $in: currentUser.userData.roles } }
                ]
            }
        ]
    });
})