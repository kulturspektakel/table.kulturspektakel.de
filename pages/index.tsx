import {useViewerQuery} from '../types/graphql';
import React from 'react';
import Page from '../components/shared/Page';
import {Content} from 'antd/lib/layout/layout';
import {Layout} from 'antd';

export default function Home() {
  const {data, refetch, error} = useViewerQuery();

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

  return (
    <Page>
      <Layout>
        <Content style={{margin: 24, padding: 24, background: 'white'}}>
          Homepage
        </Content>
      </Layout>
    </Page>
  );
}
