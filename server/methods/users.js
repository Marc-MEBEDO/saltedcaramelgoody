import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

import { Roles } from '../../imports/coreapi/collections/roles';

import { hasPermission, injectUserData } from '../../imports/coreapi/helpers/roles';
import { escapeRegExp } from '../../imports/coreapi/helpers/basics';
import { Activities } from '../../imports/coreapi/collections/activities';
import { UserActivities } from '../../imports/coreapi/collections/userActivities';
import { getModuleStore } from '../../imports/coreapi';

const SECRET_PASSWORD = 'jhd&%/f54ff!54hDRa6 H9La3"6*~';

Meteor.methods({
    'users.getExperts'(refOpinion, searchText){
        check(refOpinion, String);
        check(searchText, String);

        let currentUser = Meteor.users.findOne(this.userId);

        // check if opinion was sharedWith the current User
        /*const shared = Opinions.findOne({
            _id: refOpinion,
            "sharedWith.user.userId": this.userId
        });*/

        if (!shared) {
            throw new Meteor.Error('Das angegebene Gutachten wurde nicht mit Ihnen geteilt. Sie können keinen Gutachter auswählen.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        /*if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten des Gutachtens. Sie können keinen Gutachter auswählen.');
        }*/

        
        /*const opinionOwners = Opinions.findOne({
            _id: refOpinion
        }).sharedWith.filter( item => {
            return item.role === 'OWNER';
        }).map( item => item.user.userId );*/

        const escapedText = escapeRegExp(searchText);

        /* Wer kann alles Gutachter sein?
            - Der Owner des Gutachtens
            - Jeder Mitarbeiter von MEBEDO -> Rolle EMPLOYEE
            - Und ggf. der Admin -> Rolle ADMIN
        */
        const users =  Meteor.users.find({
            $and: [
                {'userData.roles': { $in: ['EMPLOYEE', 'ADMIN', 'OWNER'] }},
                { 
                    $or: [
                        { 'username': { $regex : escapedText, $options:"i" } },
                        { 'userData.firstName': { $regex : escapedText, $options:"i" } },
                        { 'userData.lastName': { $regex : escapedText, $options:"i" } },
                        { _id: { $in: opinionOwners } }
                    ]
                }
            ]
        }, { fields: { 'userData.roles': 0 }, limit: 10 }).fetch().map( user => {
            const { _id, username, userData } = user;

            return { userId: _id, username, ...userData};
        });
        
        return users;
    },

    /**
     * Lists all users that a currently in the system
     * 
     * @param {*} refOpinion 
     * @param {*} searchText 
     */
    'users.getAll'(refOpinion, searchText){
        check(refOpinion, String);
        check(searchText, String);

        const escapedText = escapeRegExp(searchText);

        const users =  Meteor.users.find({
            $or: [
                { 'username': { $regex : escapedText, $options:"i" } },
                { 'userData.firstName': { $regex : escapedText, $options:"i" } },
                { 'userData.lastName': { $regex : escapedText, $options:"i" } }
            ]
        }, { fields: { 'userData.roles': 0 }, limit: 10 }).fetch().map( user => {
            const { _id, username, userData } = user;

            return { userId: _id, username, ...userData};
        });
        
        return users;
    },

    /**
     * Returns alle Roles, that could be used by the current User
     * to assign to a new User
     */
    'users.getInvitableRoles'() {
        if (!this.userId) {
            throw new Meteor.Error('Sie sind nicht angemeldet.');
        }

        let inviteableRoles = {};
        const currentUser = Meteor.users.findOne(this.userId);

        Roles.find({
            _id: { $in: currentUser.userData.roles }
        }, { fields: { _id: 1, invitableRoles: 1 } }).fetch().map( role => {
            role.invitableRoles.forEach( ir => {
                inviteableRoles[ir.roleId] = ir.displayName
            })
        });
        
        return Object.keys(inviteableRoles).map( k => {
            return { roleId: k, displayName: inviteableRoles[k] }
        });
    },

    /**
     * Invite a new user to the system
     * 
     * @param {Object} data Specifies the min Data for a new user
     */
    'users.inviteUser'(refOpinion, data) {
        check(refOpinion, String);
        check(data, Object);
        check(data.email, String);
        check(data.firstName, String);
        check(data.lastName, String);
        check(data.gender, String);

        if (!this.userId) {
            throw new Meteor.Error('Not Authorized.');
        }

        let currentUser = Meteor.users.findOne(this.userId);

        // always save email in lower case
        data.email = data.email.toLowerCase();

        // check if opinion was sharedWith the current User
        /*const shared = Opinions.findOne({
            _id: refOpinion,
            "sharedWith.user.userId": this.userId
        });*/

        if (!shared) {
            throw new Meteor.Error('Das angegebene Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'shareWith')) {
            throw new Meteor.Error('Sie besitzen keine Berechtigung zum Teilen des Gutachtens mit anderen Benutzern.');
        }

        const { email, firstName, lastName } = data;

        const userId = Accounts.createUser({
            email,
            password: SECRET_PASSWORD
        });

        Meteor.users.update(userId, {
            $set: { userData: data }
        });

        /*Opinions.update(refOpinion, {
            $push: { 
                sharedWith: { 
                    user: { userId, firstName, lastName }
                }
            }
        });*/

        // post a new Aktivity to this opinion that a new user
        // has acces to this opinion
        const activity = injectUserData({ currentUser }, {
            refOpinion,
            refDetail: null,
            type: 'SYSTEM-POST',
            message: `hat das Gutachten mit dem Benutzer <strong>${firstName + ' ' + lastName}</strong> geteilt.`
        }, { created: true });
        
        Activities.insert(activity);

        Accounts.sendVerificationEmail(userId, email);
    },

    /**
     * Share the specified opinion with a existing user
     * 
     * @param {Object} data Specifies the min Data for a new user
     */
    'users.shareWith'(productId, moduleId, recordId, data) {
        check(recordId, String);

        if (!this.userId) {
            throw new Meteor.Error('Not Authorized.');
        }

        let currentUser = Meteor.users.findOne(this.userId);
        const moduleStore = getModuleStore(moduleId);

        // check if opinion was sharedWith the current User
        const shared = moduleStore.findOne({
            _id: recordId,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Der angegebene Datensatz wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'shareWith')) {
            throw new Meteor.Error('Sie besitzen keine Berechtigung zum Teilen der Daten mit anderen Benutzern.');
        }

        const { userId, firstName, lastName } = data;


        const alreadyShared = moduleStore.findOne({
            _id: recordId,
            "sharedWith.user.userId": userId
        });
        if (alreadyShared) {
            throw new Meteor.Error('Die Daten sind bereits mit dem ausgewählten Benutzer geteilt.');
        }

        const record = moduleStore.findOne(recordId);

        moduleStore.update(recordId, {
            $push: { 
                sharedWith: { 
                    user: { userId, firstName, lastName }
                }
            }
        });

        // post a new Aktivity to this record that a new user
        // has acces to this opinion
        const activity = injectUserData({ currentUser }, {
            recordId,
            moduleId,
            productId,
            type: 'SYSTEM-POST',
            message: `hat die Adresse mit dem Benutzer <strong>${firstName + ' ' + lastName}</strong> geteilt.`
        }, { created: true });
        
        Activities.insert(activity);


        UserActivities.insert(
            injectUserData({ currentUser }, {
                refUser: userId,
                type: 'SHAREDWITH',
                refs: { recordId },
                message: `${currentUser.userData.firstName} ${currentUser.userData.lastName} hat ***** mit Ihnen geteilt.`,
                originalContent: `Original content ????`,
                unread: true
            }, { created: true })
        );
    },

    /**
     * Returns the initial password to change at verifyEmail
     * 
     */
    'users.getInitialPassword'(){
        if (!this.userId) {
            throw new Meteor.Error('Not Authorized.');
        }

        return SECRET_PASSWORD;
    },

    /**
     * Update the current logged in users profile
     * 
     * @param {Object} data 
     */
    'users.updateProfile'(data) {
        if (!this.userId) {
            throw new Meteor.Error('Not Authorized.');
        }

        const oldUser = Meteor.users.findOne(this.userId);

        Meteor.users.update(this.userId, {
            $set: { 
                userData: { ...data, roles: oldUser.userData.roles }
            }
        });

        // check if firstName or lastName changed
        if (
            oldUser.userData.firstName !== data.firstName || 
            oldUser.userData.lastName !== data.lastName
        ) {
            /*Opinions.update({
                'sharedWith.user.userId': this.userId
            }, {
                $set: { 
                    'sharedWith.$.user': { userId: this.userId, firstName: data.firstName, lastName: data.lastName }
                }
            }, { multiple: true });
            */
            Activities.update({
                'createdBy.userId': this.userId
            }, {
                $set: { 
                    'createdBy.firstName': data.firstName,
                    'createdBy.lastName': data.lastName
                }
            }, { multiple: true });

            Activities.update({
                'answers.createdBy.userId': this.userId
            }, {
                $set: { 
                    'answers.$.createdBy.firstName': data.firstName,
                    'answers.$.createdBy.lastName': data.lastName
                }
            }, { multiple: true });
        }

        /*Opinions.update({
            'expert1.userId': this.userId
        }, {
            $set: { 
                'expert1': { userId: this.userId, ...data }
            }
        }, { multiple: true });

        Opinions.update({
            'expert2.userId': this.userId
        }, {
            $set: { 
                'expert2': { userId: this.userId, ...data }
            }
        }, { multiple: true });
        */
    }

});

Accounts.emailTemplates.siteName = 'MEBEDO GutachtenPlus';
Accounts.emailTemplates.from = 'MEBEDO Consulting GmbH <gutachtenplus@mebedo-ac.de>';

Accounts.emailTemplates.enrollAccount.subject = (user) => {
  return `Welcome to Awesome Town, ${user.userData.firstName}`;
};

Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  return 'You have been selected to participate in building a better future!'
    + ' To activate your account, simply click the link below:\n\n'
    + url;
};

Accounts.emailTemplates.resetPassword.from = () => {
  // Overrides the value set in `Accounts.emailTemplates.from` when resetting
  // passwords.
  return 'AwesomeSite Password Reset <no-reply@example.com>';
};

Accounts.emailTemplates.verifyEmail = {
   subject() {
      return "MEBEDOs World - Zugang aktivieren";
   },
   html(user, url) {
        const { gender, firstName, lastName} = user.userData;
        const [ host, token ] = url.split('/#/verify-email/');

        return `Guten Tag ${gender} ${lastName},<br>
            <p>
                Sie sind eingeladen im System <strong>MEBEDOs World</strong> mitzuwirken!
            </p>
            <p>
                Hierfür wurde ein Benutzer mit Ihrer E-Mailadresse angelegt.
                <br>
                Wir bitten Sie um Bestätigung dieses Benutzerzugangs indem Sie den nachfolgenden Link anwählen.
                <br>
                Mit der Bestätigung werden Sie automatisch aufgefordert Ihr Kennwort zu vergeben.
                <br>
                <br>
                <a href="https://gutachten.mebedo-ac.de/verify-email/${token}" target="_blank">Jetzt Zugang bestätigen</a>
            </p>
            <p>
                Nach erfolgreicher Bestätigung können Sie jederzeit die Anwendung über <a href="https://gutachten.mebedo-ac.de">gutachten.mebedo-ac.de</a> erreichen.
            </p>
            <p>
                Sollten Sie Fragen haben, so wenden Sie sich bitte direkt an:
                <br>
                <br>MEBEDO Consulting GmbH
                <br><strong>Herrn Rene Schulte ter Hardt</strong>
                <br>Aubachstraße 22
                <br>56410 Montabaur
                <br>
                <br>Telefon: <a href="tel:+49260295081298">+49(0)2602 9508-1298</a>
                <br>E-Mail: schulteterhardt@mebedo-ac.de
            </p>
            <p>
                Beste Grüße
                <br>
                <br>
                <br><strong>Ihre MEBEDO Consulting GmbH</strong>
            </p>
        `;
   }
};