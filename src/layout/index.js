import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import style from './index.css'
import logo  from '../../public/antDesign.png'
import Link from 'umi/link'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default class index extends Component {
    render() {
        const selectedKeys=[this.props.location.pathname];
        return (
            <div className={style.content}>
                <Layout  className={style.content}>
                    <Header className="header">
                    <img className={style.logo} src={logo}/>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        // defaultSelectedKeys={['1']}//默认选中
                        selectedKeys={selectedKeys}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="/index" >
                            <Link to="/index">首页</Link>
                        </Menu.Item>
                        <Menu.Item key="/about">
                            <Link to="/about">关于</Link>
                        </Menu.Item>
                        <Menu.Item key="/goods">
                            <Link to="/goods">商品</Link>
                        </Menu.Item>
                    </Menu>
                    </Header>
                    <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        >
                        <SubMenu
                            key="sub1"
                            title={
                            <span>
                                <Icon type="user" />
                                subnav 1
                            </span>
                            }
                        >
                            <Menu.Item key="1">option1</Menu.Item>
                            <Menu.Item key="2">option2</Menu.Item>
                            <Menu.Item key="3">option3</Menu.Item>
                            <Menu.Item key="4">option4</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                            <span>
                                <Icon type="laptop" />
                                subnav 2
                            </span>
                            }
                        >
                            <Menu.Item key="5">option5</Menu.Item>
                            <Menu.Item key="6">option6</Menu.Item>
                            <Menu.Item key="7">option7</Menu.Item>
                            <Menu.Item key="8">option8</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub3"
                            title={
                            <span>
                                <Icon type="notification" />
                                subnav 3
                            </span>
                            }
                        >
                            <Menu.Item key="9">option9</Menu.Item>
                            <Menu.Item key="10">option10</Menu.Item>
                            <Menu.Item key="11">option11</Menu.Item>
                            <Menu.Item key="12">option12</Menu.Item>
                        </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <Content
                        style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                        >
                            {this.props.children}
                        </Content>
                    </Layout>
                    </Layout>
                </Layout>  
            </div>
        )
    }
}
