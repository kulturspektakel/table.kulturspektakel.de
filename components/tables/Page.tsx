import {Layout, Menu} from 'antd';
import React from 'react';
import Page from '../shared/Page';
import {gql} from '@apollo/client';
import {useTablesQuery} from '../../types/graphql';
import {Content} from 'antd/lib/layout/layout';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Slots from './Slots';

gql`
  query Tables {
    areas {
      id
      displayName
    }
  }
`;

export default function TablesPage({children}: {children: any}) {
  const {
    query: {area},
  } = useRouter();
  const {data} = useTablesQuery();
  return (
    <Page title="Tables">
      <Layout>
        <Layout.Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['areas', String(area)]}
            defaultOpenKeys={['areas']}
            style={{height: '100%', borderRight: 0}}
          >
            <Menu.Item key="">
              <Link href="/tables">Reservierungen</Link>
            </Menu.Item>
            <Menu.SubMenu title="Areas" key="areas">
              {data?.areas.map((area) => (
                <Menu.Item key={area.id}>
                  <Link href={`/tables/area/${area.id}`}>
                    {area.displayName}
                  </Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          </Menu>
        </Layout.Sider>
        <Content style={{padding: 24}}>{children}</Content>
      </Layout>
    </Page>
  );
}
