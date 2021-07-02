import React, { Fragment } from 'react';
import PageHeader from 'antd/lib/page-header';
import Breadcrumb from 'antd/lib/breadcrumb';

export const ActivitiesForm = () => {
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Start</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">Aktivitäten</a>
                    </Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                className="site-page-header"
                title="Aktivitäten"
                subTitle="Übersicht und Zusammenfassung der letzten Aktivitäten"
            />
        </Fragment>
    );
}