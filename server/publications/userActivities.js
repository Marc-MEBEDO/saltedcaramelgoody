import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { UserActivities } from '/imports/api/collections/userActivities';

Meteor.publish('userActivities', function publishActivities() {
    return UserActivities.find({ refUser: this.userId });
});
