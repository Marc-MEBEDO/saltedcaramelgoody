import { Meteor } from 'meteor/meteor';
import { Images } from '/imports/api/collections/images';

/**
 * Publish images
 * 
 * @param0 {Any} refImages  [Array of _id's] String:_id or null| undefined
 */
Meteor.publish('images', function (refImages) {
    let imageCursor = null;
    let additionalImageIds = [];
    if (Array.isArray(refImages)) {
        imageCursor = Images.find( { _id: { $in:refImages } } ).cursor;    
    } else if ((typeof refImages === 'string' || refImages instanceof String)) {
        imageCursor = Images.find( { _id: refImages } ).cursor; 
    } else {
        imageCursor = Images.find().cursor;
    }
    imageCursor.forEach( function(file){
        if ( file.meta
          && file.meta.annotStateImageId )
            additionalImageIds.push( file.meta.annotStateImageId );
    })
    if ( additionalImageIds.length > 0 ) {
        if (Array.isArray(refImages)) {
            imageCursor = Images.find( { _id: { $in:refImages.concat( additionalImageIds ) } } ).cursor;    
        } else if ((typeof refImages === 'string' || refImages instanceof String)) {
            additionalImageIds.push(refImages);
            imageCursor = Images.find( { _id: { $in:additionalImageIds } } ).cursor;    
            //imageCursor = Images.find( { _id: refImages } ).cursor; 
        }
    }
    return imageCursor;
});