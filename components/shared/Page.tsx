import Head from 'next/head';
import styles from './Page.module.css';
import {useViewerQuery} from '../../types/graphql';
import {Avatar, Dropdown, Layout, Menu} from 'antd';
import React from 'react';
const {Header, Footer, Sider, Content} = Layout;
import Link from 'next/link';
import {useRouter} from 'next/dist/client/router';

export default function Page({
  children,
  title,
}: {
  children: any;
  title?: string;
}) {
  const {data, refetch, error} = useViewerQuery();
  const {route, ...a} = useRouter();

  if (data?.viewer == null) {
    if (typeof window !== 'undefined') {
      if (error?.message === 'Not authorized') {
        // redirect to login
        window.location.assign('https://api.kulturspektakel.de/auth');
      } else {
        // fetch data client side
        refetch();
      }
    }
    return null;
  }

  console.log(route, a);

  return (
    <Layout className={styles.layout}>
      <Head>
        <title>{title ?? 'Crew'} · Kulturspektakel Gauting</title>
      </Head>
      <Header className={styles.header}>
        <Link href="/">
          <a className={styles.logo}>
            <img src="/logo.svg" />
          </a>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[route.split('/').slice(0, 2).join('/')]}
        >
          <Menu.Item key="/tables">
            <Link href="/tables">Tables</Link>
          </Menu.Item>
          <Menu.Item key="/contactless">
            <Link href="/contactless">Contactless</Link>
          </Menu.Item>
          <Menu.Item key="/booking">
            <Link href="/booking">Booking</Link>
          </Menu.Item>
        </Menu>
        <div className={styles.spacer} />
        <Dropdown
          className={styles.profileMenu}
          placement="bottomRight"
          arrow
          overlay={
            <Menu>
              <Menu.Item>
                <a href="https://api.kulturspektakel.de/logout">Logout</a>
              </Menu.Item>
            </Menu>
          }
        >
          <Avatar src={data.viewer.profilePicture}>
            {data.viewer.displayName
              .split(' ')
              .map((n) => n.substr(0, 1).toLocaleUpperCase())
              .join('')}
          </Avatar>
        </Dropdown>
      </Header>
      {children}
    </Layout>
  );
}
