import React from 'react';
import {useRouter} from 'next/dist/client/router';
import {Button, Center, Spinner, VStack} from '@chakra-ui/react';
import {gql} from '@apollo/client';
import {useReservationQuery} from '../../types/graphql';
import Page from '../../components/Page';
import Reservation from '../../components/Reservation';
import Link from 'next/link';

gql`
  query Reservation($token: String!) {
    reservationForToken(token: $token) {
      ...ReservationFragment
      reservationsFromSamePerson {
        ...ReservationFragment
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
          <Link href="/">
            <Button colorScheme="green" alignSelf="flex-end">
              Neue Reservierung
            </Button>
          </Link>
          {data.reservationForToken?.reservationsFromSamePerson.map(
            (reservation) => (
              <Reservation key={reservation.id} data={reservation} />
            ),
          )}
        </VStack>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </Page>
  );
}
