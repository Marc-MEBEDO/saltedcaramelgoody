import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Activities } from '../../imports/coreapi/collections/activities';

Meteor.publish('activities', function publishActivities({productId, moduleId, recordId }) {
    if (!productId || !moduleId || !recordId) return;
    
    check(productId, String);
    check(moduleId, String);
    check(recordId, String);

    return Activities.find({ productId, moduleId, recordId });
});