import React, { Fragment } from 'react';
import PageHeader from 'antd/lib/page-header';
import Breadcrumb from 'antd/lib/breadcrumb';

export const Home = () => {
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Start</Breadcrumb.Item>
            </Breadcrumb>

            <PageHeader
                className="site-page-header"
                title="Start"
                //subTitle=""
            />
        </Fragment>
    );
}