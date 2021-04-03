import {Layout, Menu} from 'antd';
import React from 'react';
import Page from '../../components/tables/Page';
import {gql} from '@apollo/client';
import {useTablesQuery} from '../../types/graphql';
import {Content} from 'antd/lib/layout/layout';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Slots from '../../components/tables/Slots';

gql`
  query Tables {
    areas {
      id
      displayName
    }
  }
`;

export default function Home() {
  const {
    query: {area},
  } = useRouter();
  const {data} = useTablesQuery();
  return <Page>test</Page>;
}
