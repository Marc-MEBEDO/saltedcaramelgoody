import { Meteor } from 'meteor/meteor';

import './appdesign/application';

import './fixtures';
import './publications';
import './methods'; 
import '../imports/api/methods';

import './datamigration';

import { Accounts } from 'meteor/accounts-base'

Accounts.validateLoginAttempt( loginData => {
    const { allowed, methodName } = loginData;

    if (methodName == 'verifyEmail') {
        return allowed;
    }

    if (methodName == 'login') {
        if (loginData.methodArguments[0].resume && allowed) return true;

        const { user } = loginData.methodArguments[0];
        
        // check if we got a user like "admin" that signed in without email
        if (user.username && !user.email && allowed) {
            return true;
        }

        const verifiedUser = Meteor.users.findOne({
            'emails.address': user.email,
            'emails.verified': true
        });

        return !!verifiedUser;
    }

    throw new Meteor.Error('Unknown Loginattempt rejected.');
});

Meteor.startup(() => {
    console.log('Running in ' + process.env.NODE_ENV + ' mode.');
});
