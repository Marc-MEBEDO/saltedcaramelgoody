import React from 'react';
import Tag from 'antd/lib/tag';


import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { Roles } from '../coreapi/collections/roles';
import { Activities } from '../coreapi/collections/activities';
import { UserActivities } from '../coreapi/collections/userActivities';
import { Images } from '../api/collections/images';
import { Layouttypes } from '../api/collections/layouttypes';
import { Avatars } from '../api/collections/avatars';

import { Products } from '../coreapi/collections/products';
import { Mods } from '../coreapi/collections/mods';
import { Reports } from '../coreapi/collections/reports';

import { getModuleStore } from '../coreapi';
import { isArray } from '../coreapi/helpers/basics';

const notAuthorized = [ [] /*data*/, false /*loadin*/ ]
const noDataAvailable = [ [] /*data*/ , true /*loading*/ ];

import moment from 'moment';

/**
 * Reactive current User Account
 */
export const useAccount = () => useTracker(() => {
    const user = Meteor.user();
    const userId = Meteor.userId();

    const subscription = Meteor.subscribe('currentUser');
    let currentUser = null;

    if (subscription.ready()) {
        currentUser = Meteor.users.findOne({_id:userId}, { fields: { username: 1, userData: 1 }});
    }

    return {
        user,
        userId,
        currentUser,
        isLoggedIn: !!userId,
        accountsReady: user !== undefined && subscription.ready()
    }
}, [])

/**
 * Reactive Roles handling
 * 
 */
export const useRoles = () => useTracker( () => {
    if (!Meteor.user()) {
        return notAuthorized;
    }
    const subscription = Meteor.subscribe('roles');

    if (!subscription.ready()) { 
        return noDataAvailable;
    }

    const roles = Roles.find({}, { sort: {title: 1}}).fetch();

    return [roles, false];
});

/**
 * Reactive Layouttypes
 * 
 */
/*export const useLayouttypes = () => useTracker( () => {

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const subscription = Meteor.subscribe('layouttypes');

    if (!subscription.ready()) { 
        return noDataAvailable;
    }

    const layouttypes = Layouttypes.find({}).fetch();

    return [layouttypes, false];
});*/


/**
 * Load Activities reactivly for a given opinion or opinionDetail
 * 
 * @param {String} refOpinion   id of the Opinion
 * @param {String} refDetail    id of the OpinionDetail
 */
export const useActivities = (productId, moduleId, recordId) => useTracker( () => {
    if (!Meteor.user()) {
        return notAuthorized;
    }
    const subscription = Meteor.subscribe('activities', { productId, moduleId, recordId });

    if (!subscription.ready()) {
        return noDataAvailable;
    }


    const activities = Activities.find({ productId, moduleId, recordId }, { sort: { createdAt: 1}}).fetch();

    return [ activities, false ];
}, [productId, moduleId, recordId]);


/**
 * Returns the count of unread user-activities reactively
 * 
 */
export const useUserActivityCount = () => useTracker( () => {
    if (!Meteor.user()) {
        return [ null, false ];
    }
    const subscription = Meteor.subscribe('userActivities');

    if (!subscription.ready()) {
        return noDataAvailable;
    }

    const count = UserActivities.find({ unread: true }).count();

    return [ count, false ];
}, []);

/**
 * Load the userActivities reactivly
 * 
 * @param {String} refOpinion   id of the Opinion
 * @param {String} refDetail    id of the OpinionDetail
 */
export const useUserActivities = ({orderBy}) => useTracker( () => {
    if (!Meteor.user()) {
        return notAuthorized;
    }
    const subscription = Meteor.subscribe('userActivities');

    if (!subscription.ready()) {
        return noDataAvailable;
    }

    const sort = orderBy || { createdAt: 1};
    return [
        UserActivities.find({}, { sort }).fetch(),
        false
    ];
});


/**
 * Load the Images reactivly
 * 
 * @param {String} refOpinion   id of the Opinion
 * @param {String} refDetail    id of the OpinionDetail
 */
/*export const useImages = refImages => useTracker( () => {
    if (!Meteor.user()) {
        return notAuthorized;
    }
    const subscription = Meteor.subscribe('images', refImages);

    if (!subscription.ready()) {
        return noDataAvailable;
    }

    let images = [];
    if (Array.isArray(refImages)) {
        images = Images.find( { _id: { $in: refImages } } ).fetch();    
    } else if ((typeof refImages === 'string' || refImages instanceof String)) {
        images = Images.find( { _id: refImages } ).fetch(); 
    } else {
        images = Images.find().fetch();
    }
    return [
        images.map( file => {
            let link = Images.findOne({_id: file._id}).link();
            file.link = link;
            if ( file.meta
              && file.meta.annotStateImageId ) {
                let link2 = Images.findOne({_id: file.meta.annotStateImageId}).link();
                file.link2 = link2;
            }
            return file;
        }),
        false
    ];
});*/


/**
 * Load the current Avatar for the given user
 * 
 * @param {String} userId   Specifies the user
 */
export const useAvatar = userId => useTracker( () => {
    const noDataAvailable = [ null /*avatar*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('avatar', userId);

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const avatar = Avatars.findOne({ userId });

    return [
        avatar ? avatar.link() : null,
        false
    ];
}, [userId]);


/**
 * Load the Products that are shared with the current user
 * 
 * @param {String} userId   Specifies the user
 */
 export const useProducts = () => useTracker( () => {
    const noDataAvailable = [ [] /*products*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('products');

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const products = Products.find({}, { sort: { position: 1 } }).fetch();

    return [ products, false ];
});

/**
 * Lese das angegeben Produkt für den aktuellen Benutzer
 * 
 * @param {String} userId   Specifies the user
 */
 export const useProduct = (productId) => useTracker( () => {
    const noDataAvailable = [ null /*product*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('product', productId);

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const product = Products.findOne(productId);

    return [ product, false ];
});


/**
 * Lese alle Module zu einem bestimmten Produkt
 * 
 * @param {String} userId   Specifies the user
 */
 export const useModulesByProduct = productId => useTracker( () => {
    const noDataAvailable = [ [] /*modules*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('modules', productId);

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const mods = Mods.find({ productId }, { sort: { position: 1 } }).fetch();

    return [ mods, false ];
}, [productId]);

/** 
 * Lese das angegeben Modul
 * 
 * @param {String} userId   Specifies the user
 */
 export const useModule = moduleId => useTracker( () => {
    const noDataAvailable = [ null /*module*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('module', moduleId);

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const mod = Mods.findOne(moduleId);

    return [ mod, false ];
}, [moduleId]);


/** 
 * Lesen des angegeben Datensatzes
 * 
 * @param {String} userId   Specifies the user
 */
 export const useRecord = (productId, moduleId, recordId, reloadRevision) => useTracker( () => {
    if (!recordId) return [null, false];

    const noDataAvailable = [ null /*record*/ , true /*loading*/];

    if (!Meteor.user()) {
        return notAuthorized;
    }

    const moduleStore = getModuleStore(moduleId);

    const handler = Meteor.subscribe('record', { productId, moduleId, recordId });

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const doc = moduleStore.findOne(recordId);

    // transform Date to moment
    Object.keys(doc).forEach(propName => {
        const v = doc[propName];
        if (v && v instanceof Date) {
            doc[propName] = moment(v);
        } else if (v && isArray(v) && v.length > 0 && v[0] instanceof Date) {
            v[0] = moment(v[0]);
            v[1] = moment(v[1]);
            doc[propName] = v;
        }
    });

    return [ doc, false ];
}, [productId, moduleId, recordId, reloadRevision]);


/** 
 * Lesen des angegeben Reports
 * 
 */
 export const useReport = (reportId) => useTracker( () => {
    if (!reportId) return [null, false];

    const noDataAvailable = [ null /*record*/ , true /*loading*/];

    if (!Meteor.user()) {
        return notAuthorized;
    }

    const handler = Meteor.subscribe('report', { reportId });

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const report = Reports.findOne(reportId);
    
    if (report.columns) {
        report.columns = report.columns.map( c => {
            const fnCode = c.render;
            if (fnCode) {
                c.render = function renderColumn(col, doc) {
                    let renderer = eval(fnCode);
                    return renderer(col, doc, report.additionalData || {});
                }
            };
            
            return c;
        });
    }
    return [ report, false ];
}, [reportId]);


