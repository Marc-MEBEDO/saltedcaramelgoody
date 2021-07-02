import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '/imports/api/collections/opinions';
import { Activities } from '/imports/api/collections/activities';

Meteor.publish('activities', function publishActivities({ refOpinion, refDetail }) {
    check(refOpinion, String);
    if (refDetail) check(refDetail, String);

    // check if opinion is shared with the current user
    let permitted = Opinions.findOne({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;
    
    // elemenating undefned
    refDetail = refDetail || null;
    if (refDetail)
        return Activities.find({ refDetail });
    if (refOpinion)
        return Activities.find({ refOpinion, refDetail });
});
