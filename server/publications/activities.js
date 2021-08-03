import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Activities } from '../../imports/coreapi/collections/activities';

Meteor.publish('activities', function publishActivities({ moduleId }) {
    check(moduleId, String);

    return Activities.find({ moduleId });
});