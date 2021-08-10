import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import { App } from '/imports/ui/App';


import { Home } from '../imports/ui/Home';
import { Dashboard } from '../imports/ui/Dashboard';
import { Record } from '../imports/ui/Record';
import { Report } from '../imports/ui/Report';

import { InfoForm } from '../imports/ui/Info';

import { AppState } from '../imports/client/AppState';
import { VerifyEMail } from '../imports/ui/components/VerifyEMail';
import { UserProfileForm } from '../imports/ui/components/user-profile-form';

// https://github.com/kadirahq/flow-router/issues/318
// Prevent routing when there are unsaved changes
// ----------------------------------------------

// This function will be called on every route change.
// Return true to 'prevent' the route from changing.
function preventRouteChange (targetContext) {
    if (AppState.selectedDetail && AppState.selectedDetail.isDirty()) {
      if (!window.confirm('Achtung! Sie befinden sich aktuell in der Bearbeitung eines Details.\n\nMöchten Sie Ihre Änderungen verwerfen?')) {
        return true;
      }
      AppState.selectedDetail.discardChanges();
    }
    if (AppState.selectedDetail) AppState.selectedDetail.discardChanges();
    return false;
  }
  
  // Workaround FlowRouter to provide the ability to prevent route changes
  var previousPath,
    isReverting,
    routeCounter = 0,
    routeCountOnPopState;
  
  window.onpopstate = function () {
    // For detecting whether the user pressed back/forward button.
    routeCountOnPopState = routeCounter;
  };
  
  FlowRouter.triggers.exit([function (context, redirect, stop) {
    // Before we leave the route, cache the current path.
    previousPath = context.path;
  }]);
  
  FlowRouter.triggers.enter([function (context, redirect, stop) {
    routeCounter++;
  
    if (isReverting) {
      isReverting = false;
      // This time, we are simply 'undoing' the previous (prevented) route change.
      // So we don't want to actually fire any route actions.
      stop();
    }
    else if (preventRouteChange(context)) {
      // This route change is not allowed at the present time.
  
      // Prevent the route from firing.
      stop();
  
      isReverting = true;
  
      if (routeCountOnPopState == routeCounter - 1) {
        // This route change was due to browser history - e.g. back/forward button was clicked.
        // We want to undo this route change without overwriting the current history entry.
        // We can't use redirect() because it would overwrite the history entry we are trying
        // to preserve.
  
        // setTimeout allows FlowRouter to finish handling the current route change.
        // Without it, calling FlowRouter.go() at this stage would cause problems (we would
        // ultimately end up at the wrong URL, i.e. that of the current context).
        setTimeout(function () {
            FlowRouter.go(previousPath);
        });
      }
      else {
          // This is a regular route change, e.g. user clicked a navigation control.
          // setTimeout for the same reasons as above.
          setTimeout(function () {
              // Since we know the user didn't navigate using browser history, we can safely use
              // history.back(), keeping the browser history clean.
              history.back();
          });
      }
    }
  }]);


FlowRouter.route('/verify-email/:token', {
    name: 'verifyMail',
    action({ token }) {
        mount(App, {
            content: VerifyEMail,
            token,
            authenticatedRoute: false
        });
    },
});

FlowRouter.route('/profile', {
    name: 'userprofile',
    action() {
        mount(App, {
            content: UserProfileForm,
            authenticatedRoute: true
        });
    },
});

FlowRouter.route('/', {
    name: 'root',
    action() {
        mount(App, {
            content: Home,
            authenticatedRoute: true
        });
    },
});

FlowRouter.route('/info', {
    name: 'info.show',
    action() {
        mount(App, {
            content: InfoForm,
            activeMenuKey: 'INFO',
            authenticatedRoute: true
        });
    },
});

FlowRouter.route('/dashboards/:productId/:moduleId', {
    name: 'dahsboard',
    action(params, queryParams) {
        mount(App, {
            content: Dashboard,
            authenticatedRoute: true,
            params,
            queryParams
        });
    },
});

FlowRouter.route('/records/:productId/:moduleId/new', {
    name: 'create-module-record',
    action(params, queryParams) {
        mount(App, {
            content: Record,
            authenticatedRoute: true,
            params,
            queryParams,
            mode: 'NEW',
            showActivities: true
        });
    },
});

FlowRouter.route('/records/:productId/:moduleId/:recordId', {
    name: 'show-module-record',
    action(params, queryParams) {
        mount(App, {
            content: Record,
            authenticatedRoute: true,
            params,
            queryParams,
            mode: 'SHOW',
            showActivities: true
        });
    },
});

FlowRouter.route('/reports/:productId/:moduleId/:reportId', {
    name: 'report',
    action(params, queryParams) {
        mount(App, {
            content: Report,
            authenticatedRoute: true,
            params,
            queryParams,
            mode: 'SHOW',
            showActivities: false
        });
    },
});
