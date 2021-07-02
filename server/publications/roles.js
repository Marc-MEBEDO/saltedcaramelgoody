import { Meteor } from 'meteor/meteor';
import { Roles } from '/imports/api/collections/roles';

Meteor.publish('roles', function publishRoles() {
    return Roles.find({});
});