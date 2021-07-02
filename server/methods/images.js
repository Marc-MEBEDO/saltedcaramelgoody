import { Meteor } from 'meteor/meteor';
import { Images } from './../../imports/api/collections/images';

Meteor.methods({
    'images.update.annotState'(id, dataState, imageId){
        Images.collection.update(id, {
            $set: {
                'meta.annotState': dataState,
                'meta.annotStateImageId': imageId
            }
        });
    }
});