import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getModuleStore } from '../../imports/coreapi';

import { Mods } from '../../imports/coreapi/collections/mods';
import moment from 'moment'

import SimpleSchema from 'simpl-schema';

const InfoSchema = new SimpleSchema({
    productId: { type: String },
    moduleId: { type: String },
    fieldId: { type: String },
    mode: { type: String },
    currentInput: { type: String },
    values: { type: Array },
    'values.$': new SimpleSchema({
        _id: { type: String },
        title: { type: String },
        description: { type: String },
        imageUrl: { type: String, optional: true },
        link: { type: String, optional: true },
    }),
});

Meteor.methods({
    'modules.getMetadata'(moduleId) {
        check(moduleId, String);

        const currentUser = Meteor.users.findOne(this.userId);

        if (!currentUser)
            return { moduleData: null, status: '403', message: 'Sie sind noch nicht am System angemeldet und haben keinen Zugriff auf das angegebene Modul.' }
    
        const moduleData = Mods.findOne({
            $and: [
                { _id: moduleId },
                {
                    $or: [
                        { "sharedWith.user.userId": currentUser._id },
                        { sharedWithRoles: { $in: currentUser.userData.roles } }
                    ]
                }
            ]
        });

        if (moduleData) {
            return { moduleData, status: '200', message: null }
        }

        // es wurden keine Moduldaten zurückgeliefert
        // prüfen, ob der angemeldete Benutzer nicht berechtigt ist, oder ob die
        // angegebene ModulId ungültig ist
        if (!Mods.findOne(moduleId)) {
            // die angegeben ModulId ist ungültig
            return { moduleData: null, status: '404', message: `Die ModulId "${moduleId}" ist ungültig.` }
        }

        // der angemeldete Benutzer hat keinen Zugriff/Berechtigung
        // das Modul existiert zwar aber ist nicht für diese Benutzer bestimmt
        return { moduleData: null, status: '403', message: `Sie besitzen nicht die notwendigen Berechtigungen für den Zugriff auf das Modul "${moduleId}". Der Zugriff wurde verweigert.` }
    },
    'modules.clientCollectionInit'() {
        const allModules = Mods.find({}, { fields: { _id: 1 }}).map( ({ _id }) => {
            const moduleStore = getModuleStore(_id);
            return _id; 
        });

        return allModules;
    },
    'modules.getModuleOptions'(info) {
        InfoSchema.validate(info);

        const { productId, fieldId, moduleId, currentInput, values } = info;
        
        const currentUser = Meteor.users.findOne(this.userId);
        if (!currentUser)
            return;

        const mod = Mods.findOne({ _id: moduleId });
        const field = mod.fields[fieldId];

        const moduleStore = getModuleStore(field.moduleDetails.moduleId);

        let data = moduleStore.find({
            $and: [
                { title: { $regex: currentInput, $options: 'i' } },
                { _id: { $nin: values.map( v => v._id ) } },
                {
                    $or: [
                        { "sharedWith.user.userId": currentUser._id },
                        { sharedWithRoles: { $in: currentUser.userData.roles } }
                    ]
                }
            ]
        });
        
        let getDescription = doc => {
            if (field.moduleDetails.hasDescription)
                return doc.description || null;
            return null;
        }
        // prüfen, ob es eine Funktion zum rendern der description gibt
        if (field.moduleDetails.description) {
            getDescription = eval(field.moduleDetails.description);
        }

        let getImageUrl = doc => {
            if (field.moduleDetails.hasImage)
                return doc.imageUrl || null;
            return null;
        }
        // prüfen, ob es eine Funktion zum rendern der description gibt
        if (field.moduleDetails.imageUrl) {
            getImageUrl = eval(field.moduleDetails.imageUrl);
        }

        return data.map( doc => {            
            doc.description = getDescription(doc);
            doc.imageUrl = getImageUrl(doc);

            return doc;
        });
    },
    'modules.getDefaults'(info) {
        new SimpleSchema({
            productId: { type: String },
            moduleId: { type: String },
            queryParams: { type: Object, blackbox: true, optional: true }
        }).validate(info);

        const { productId, moduleId, queryParams } = info;

        const mod = Mods.findOne({ _id: moduleId });

        if (mod && mod.methods && mod.methods.defaults) {
            fnGetDefaults = eval(mod.methods.defaults);
            return fnGetDefaults({queryParams, moment});
        } else {
            return null;
        }
    }
});