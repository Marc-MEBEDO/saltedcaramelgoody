import './routes';
import './css/summernote-lite.min.css';
import '../imports/api/methods';

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { App } from '/imports/ui/App';

Meteor.startup(() => {
    render(<App/>, document.getElementById('react-root'));
});
