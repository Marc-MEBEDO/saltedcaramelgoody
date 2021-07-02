import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Setup Admin user if not exists
const USERNAME = 'admin';
const PASSWORD = 'password';

if (!Accounts.findUserByUsername(USERNAME)) {
    Accounts.createUser({
        username: USERNAME,
        password: PASSWORD,
    });

    let newUser = Accounts.findUserByUsername(USERNAME);
     
    Meteor.users.update( newUser._id, {
        $set: {
            userData: {
                firstName: 'IT',
                lastName: 'Administrator',
                roles: ['EVERYBODY', 'ADMIN']
            }
        }
    });
}
