import { Meteor } from 'meteor/meteor';
import { Roles } from '../../imports/coreapi/collections/roles';

Meteor.publish('roles', function publishRoles() {
    return Roles.find({});
});