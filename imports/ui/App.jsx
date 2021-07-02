import React, { useEffect } from 'react';

import Spin from 'antd/lib/spin';

import { LoginForm } from '/imports/ui/LoginForm';
import { SiteLayout } from '/imports/ui/SiteLayout';
import { useAccount, useRoles } from '../client/trackers';

export const App = ({content, refOpinion, refDetail, activeMenuKey, ...props}) => {
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
        <SiteLayout 
            activeMenuKey={activeMenuKey}
            refOpinion={refOpinion}
            refDetail={refDetail}
            currentUser={currentUser}
        >
            {
                //content || null
                React.createElement(content || null, { refOpinion, refDetail, currentUser })
            }
        </SiteLayout>
    );
}   