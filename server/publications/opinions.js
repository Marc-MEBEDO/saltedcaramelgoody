import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Opinions } from '/imports/api/collections/opinions';
import { OpinionPdfs } from '../../imports/api/collections/opinion-pdfs';

Meteor.publish('opinions', function publishOpinions(id) {
    if (!id) return Opinions.find({
        "sharedWith.user.userId": this.userId
    });

    check (id, String);
    
    return Opinions.find({
        _id: id,
        "sharedWith.user.userId": this.userId
    });
});


Meteor.publish('opinion-pdfs', function publishOpinionPdfs(refOpinion) {
    check (refOpinion, String);
    
    return OpinionPdfs.find({
        "meta.refOpinion": refOpinion
    }).cursor;
});