import { Meteor } from 'meteor/meteor';
import { Layouttypes } from '/imports/api/collections/layouttypes';

Meteor.publish('layouttypes', function publishLayouttypes() {
    return Layouttypes.find({});
});