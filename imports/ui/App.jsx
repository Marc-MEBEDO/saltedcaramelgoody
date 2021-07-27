import React, { useEffect } from 'react';

import Spin from 'antd/lib/spin';

import { LoginForm } from '/imports/ui/LoginForm';
import { DefaultLayout } from './DefaultLayout';
import { useAccount, useRoles } from '../client/trackers';

export const App = ({content, params, ...props}) => {
    const { currentUser, isLoggedIn, accountsReady } = useAccount();
    const { roles, rolesLoading } = useRoles();

    useEffect(() => {
        const reactRoot = document.getElementById('react-root');
        
        // add done for the initial loading
        reactRoot.classList.add('done');
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
        <DefaultLayout currentUser={currentUser} params={params} >
            { React.createElement(content || null, { params, currentUser }) }
        </DefaultLayout>
    );
}   