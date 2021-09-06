import React, { useEffect } from 'react';

import Spin from 'antd/lib/spin';

import { LoginForm } from '/imports/ui/LoginForm';
import { DefaultLayout } from './DefaultLayout';
import { useAccount, useRoles } from '../client/trackers';

import { getModuleStore } from '../coreapi';

export const App = ({content, ...props}) => {
    const { currentUser, isLoggedIn, accountsReady } = useAccount();
    const { roles, rolesLoading } = useRoles();

    useEffect(() => {
        const reactRoot = document.getElementById('react-root');
        // add done for the initial loading
        reactRoot.classList.add('done');

        Meteor.call('modules.clientCollectionInit', (err, allModules) => {
            if (err) {
                console.log(err);
            } else {
                allModules.forEach( moduleId => {
                    const moduleStore = getModuleStore(moduleId);
                });
            }
        })      
    });

    if (!accountsReady) {
        return <Spin size="large" />
    }

    if (!props.authenticatedRoute) {
        return React.createElement(content, { ...props });
    }

    if (!isLoggedIn) {
        return <LoginForm />
    }

    return (
        <DefaultLayout currentUser={currentUser} { ...props } >
            { React.createElement(content || null, { ...props }) }
        </DefaultLayout>
    );
}   