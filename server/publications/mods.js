import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Mods } from '/imports/coreapi/collections/mods';

Meteor.publish('module', function publishModule(moduleId) {
    check(moduleId, String);

    const currentUser = Meteor.users.findOne(this.userId);

    if (!currentUser)
        return;

    return Mods.find({
        $and: [
            { _id: moduleId },
            {
                $or: [
                    { "sharedWith.user.userId": currentUser._id },
                    { sharedWithRoles: { $in: currentUser.userData.roles } }
                ]
            }
        ]
    });
});

Meteor.publish('modules', function publishModules(productId) {
    check(productId, String);

    const currentUser = Meteor.users.findOne(this.userId);

    if (!currentUser)
        return;

    return Mods.find({
        $or: [
            { "sharedWith.user.userId": currentUser._id },
            { sharedWithRoles: { $in: currentUser.userData.roles } }
        ]
    });
});