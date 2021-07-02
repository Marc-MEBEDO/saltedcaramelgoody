import { Meteor } from 'meteor/meteor';


// https://forums.meteor.com/t/aboutpage-version-in-your-app/42636
Meteor.methods({
    'app.version'() {
        try {
            var version = {};
            version = JSON.parse(Assets.getText("version.json"));
            return version;
        } catch(e) { 
            // .. Version not found
            return {};
        }
    }
});