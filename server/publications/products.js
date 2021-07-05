import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Products } from '/imports/coreapi/collections/products';

Meteor.publish('product', function publishProduct(productId) {
    check(productId, String);
    
    const currentUser = Meteor.users.findOne(this.userId);

    if (!currentUser)
        return;

    return Products.find({
        $and: [
            { _id: productId },
            {
                $or: [
                    { "sharedWith.user.userId": currentUser._id },
                    { sharedWithRoles: { $in: currentUser.userData.roles } }
                ]        
            }
        ]
    });
});

Meteor.publish('products', function publishProducts() {
    const currentUser = Meteor.users.findOne(this.userId);

    if (!currentUser)
        return;

    return Products.find({
        $or: [
            { "sharedWith.user.userId": currentUser._id },
            { sharedWithRoles: { $in: currentUser.userData.roles } }
        ]
    });
});