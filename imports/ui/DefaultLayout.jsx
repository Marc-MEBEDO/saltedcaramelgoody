import React, { Fragment, useState } from 'react';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Spin from 'antd/lib/spin';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

import { ListActivities } from './ListActivities';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { useProducts, useModulesByProduct } from '../client/trackers';
import { MediaQuery, useMediaQueries } from '../client/mediaQueries';

const Logo = () => {
    return (
        <div className="mbac-logo" >
            <img className="large" src="/MEBEDO_LOGO_PRINT_RGB-300x88.jpg" />
        </div>
    );
}

const ProductMenu = props => {
    const { product } = props;

    const [ mods, modulesLoading ] = useModulesByProduct(product._id);
    
    if (modulesLoading || mods.length == 0)
        return <SubMenu {...props} icon={<i className={product.faIconName} style={{ marginRight:16 }}/>} title={product.title} />
    
    return (
        <SubMenu {...props} icon={<i className={product.faIconName} style={{ marginRight:16 }}/>} title={product.title} >
            {
                mods.map( m => 
                    m.isSeparator 
                        ? <hr key={m._id} style={{width:'80%'}}/> 
                        : <Menu.Item key={m._id}><span><i className={m.faIconName} style={{ marginRight:16 }}/>{m.title}</span></Menu.Item>
                )
            }
        </SubMenu>
    );
}

const ProductsMenu = ({theme='light', mode, displayLogo}) => {
    const [ products, productsLoading ] = useProducts();

    const handleClick = ({ item, key, keyPath, domEvent }) => {
        FlowRouter.go('/dashboards/' + keyPath.reverse().join('/'));
    }

    if (productsLoading) return <Spin />

    return (
        <Menu theme={theme} mode={mode} onClick={handleClick}>
            { !displayLogo ? null :
                <Menu.Item key="mbac-logo" style={{cursor:'pointer', background:'#fff'}}>
                    <Logo />
                </Menu.Item>            
            }
            {
                products.map( p =>
                    <ProductMenu key={p._id} product={p} /> 
                )
            }
        </Menu>
    )
}

export const DefaultLayout = props => {
    const { currentUser, params } = props;

    return (
        <Layout>
            <MediaQuery showAtPhone >
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <ProductsMenu theme="dark" mode="inline" />
                </Sider>
            </MediaQuery>

            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0, background:'#fff' }}>
                    <MediaQuery showAtPhone >
                        <Logo />
                    </MediaQuery>

                    <MediaQuery showAtTablet showAtDesktop >
                        <ProductsMenu displayLogo mode="horizontal" />
                    </MediaQuery>
                </Header>

                <Content style={{ margin: '96px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: 1260, background:'#fff' }}>
                        { props.children }
                    </div>
                </Content>
                
                <MediaQuery showAtTablet showAtDesktop >
                    <Sider 
                        /*style={{
                            overflow: 'hidden auto',
                            height: '100vh',
                            position: 'fixed',
                            right: 0,
                        }}*/
                        theme="light" width="300" collapsible 
                    >
                        <Content style={{marginTop:60}}>
                            <ListActivities 
                                productId={params.productId}
                                modulId={params.modulId}
                                currentUser={currentUser}
                            />
                        </Content>
                    </Sider>
                </MediaQuery>
            </Layout>

            
        </Layout>
    );
}

/*<Footer style={{ textAlign: 'center' }}>
MEBEDO Akademie GmbH, MEBEDO Consulting GmbH ©2021
</Footer>*/

