import React from 'react';
import {useRouter} from 'next/dist/client/router';
import {SlotProps} from '../../components/Slot';
import {Button, Input, Stack} from '@chakra-ui/react';
import {gql} from '@apollo/client';
import {useReservationQuery} from '../../types/graphql';

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

export default function Reservation() {
  const {query} = useRouter();
  const {data} = useReservationQuery({variables: {token: String(query.token)}});

  return (
    <div>
      {data.reservationsForToken.map((reservation) => (
        <li>{reservation.reservationSlots}</li>
      ))}
    </div>
  );
}
