import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Reports } from '../../imports/coreapi/collections/reports';

Meteor.methods({
    'reports.getReportDefinition'( { reportId }) {
        check(reportId, String);

        return Reports.findOne({ _id: reportId });
    }
});