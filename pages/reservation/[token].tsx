import React from 'react';
import {useRouter} from 'next/dist/client/router';
import {Center, Spinner, VStack} from '@chakra-ui/react';
import {gql} from '@apollo/client';
import {useReservationQuery} from '../../types/graphql';
import Page from '../../components/Page';
import Reservation from '../../components/Reservation';

gql`
  query Reservation($token: String!) {
    reservationsForToken(token: $token) {
      id
      status
      reservationSlots {
        id
        startTime
        endTime
        area {
          displayName
        }
      }
    }
  }
`;

export default function Reservations() {
  const {query} = useRouter();
  const {data} = useReservationQuery({variables: {token: String(query.token)}});

  return (
    <Page>
      {data ? (
        <VStack spacing="3" alignItems="stretch">
          {data.reservationsForToken.map((reservation) => (
            <Reservation key={reservation.id} data={reservation} />
          ))}
        </VStack>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </Page>
  );
}
