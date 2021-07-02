import React, { Fragment } from 'react';

import PageHeader from 'antd/lib/page-header';
import Breadcrumb from 'antd/lib/breadcrumb';
import Result from 'antd/lib/result';
import Button from 'antd/lib/button';
import Affix from 'antd/lib/affix';
import Layout from 'antd/lib/layout';
import Descriptions from 'antd/lib/descriptions';
import Skeleton from 'antd/lib/skeleton';

const { Content } = Layout;


export class InfoForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sysinfo: {},
            loading: true
        }
    }

    componentDidMount() {
        Meteor.call('app.version', (err, version) => {
            if (!err){
                setTimeout(() => {
                    this.setState({ sysinfo: { appVersion: version }, loading: false });
                }, 500)
            }
        });
    }

    render() {
        const { sysinfo, loading } = this.state;
        const { currentUser } = this.props;

        return (
            <Layout>
                <Content>
                    <Affix className="affix-opiniondetail" offsetTop={0}>
                        <Breadcrumb>
                            <Breadcrumb.Item>Start</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="">Info</a>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <PageHeader
                            className="site-page-header"
                            title="Systeminformationen"
                            onBack={() => history.back()}
                        />
                    </Affix>

                    <Result
                        status="404"
                        title="Systeminformationen"
                        subTitle={
                            <Fragment>
                                <p>Nachfogend sehen sie die aktuellen Informationen des Systems und Ihrer Anmeldung.</p>
                                
                                { loading 
                                    ? <Skeleton active />
                                    : <Descriptions column={ {xs: 1, sm: 1, md: 2, ld: 2} } bordered>
                                        <Descriptions.Item label="Version">{sysinfo.appVersion && sysinfo.appVersion.version}</Descriptions.Item>
                                        <Descriptions.Item label="Timestamp">{sysinfo.appVersion && sysinfo.appVersion.timestamp}</Descriptions.Item>

                                        <Descriptions.Item label="Benutzername / E-Mail">{currentUser.username || currentUser.userData.email}</Descriptions.Item>
                                        <Descriptions.Item label="Rollen">{currentUser.userData.roles.join(', ')}</Descriptions.Item>
                                    </Descriptions>
                                }
                            </Fragment>
                        }
                        extra={<Button type="primary" onClick={() => history.back()}>Zurück</Button>}
                    />
                </Content>
            </Layout>
        );
    }
}