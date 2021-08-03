import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { UserActivities } from '../../imports/coreapi/collections/userActivities';

Meteor.publish('userActivities', function publishActivities() {
    return UserActivities.find({ refUser: this.userId });
});
