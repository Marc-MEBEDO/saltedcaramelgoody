import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Avatars } from '../../imports/api/collections/avatars';

Meteor.publish('currentUser', function publishCurrentUser() {
    // extra publish with the field of userdata: { ... }
    // by default meteor only publishs id and username
    return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('avatar', function publishAvatar(userId) {
    check(userId, String);

    if (!this.userId) return null;

    return Avatars.find({ userId }).cursor;
});