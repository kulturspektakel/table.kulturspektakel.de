import {Layout, Menu} from 'antd';
import React from 'react';
import Page from '../../../components/tables/Page';
import {gql} from '@apollo/client';
import {useSlotsQuery, useTablesQuery} from '../../../types/graphql';
import {Content} from 'antd/lib/layout/layout';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Slots from '../../../components/tables/Slots';

gql`
  query Slots($areaId: ID!) {
    area(id: $areaId) {
      friday: reservableSlots(partySize: 0, date: "2020-01-01") {
        reservationSlot {
          id
          startTime
          endTime
        }
      }
    }
  }
`;

export default function Home() {
  const {
    query: {area},
  } = useRouter();
  const {data} = useSlotsQuery({variables: {areaId: String(area)}});
  console.log(data?.area?.friday);
  return (
    <Page>
      <Slots area={String(area)} />
    </Page>
  );
}
