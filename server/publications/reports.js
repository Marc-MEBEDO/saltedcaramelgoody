import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Reports } from '/imports/coreapi/collections/reports';


Meteor.publish('report', function publishReport({ reportId }) {
    check(reportId, String);

    const currentUser = Meteor.users.findOne(this.userId);

    if (!currentUser)
        return;

    return Reports.find({
        $and: [
            { _id: reportId },
            {
                $or: [
                    { "sharedWith.user.userId": currentUser._id },
                    { sharedWithRoles: { $in: currentUser.userData.roles } }
                ]
            }
        ]
    });
})