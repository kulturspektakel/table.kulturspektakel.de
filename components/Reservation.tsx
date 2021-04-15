import {gql} from '@apollo/client';
import {Badge, Box, Button} from '@chakra-ui/react';
import React from 'react';
import {ReservationFragmentFragment, ReservationStatus} from '../types/graphql';

const RESERVATION_STATUS: Record<ReservationStatus, string> = {
  [ReservationStatus.Confirmed]: 'Bestätigt',
  [ReservationStatus.Pending]: 'Unbestätigt',
  [ReservationStatus.CheckedIn]: 'Eingechekt',
  [ReservationStatus.Cleared]: 'abgesagt',
};

const RESERVATION_COLOR: Record<ReservationStatus, string> = {
  [ReservationStatus.Confirmed]: 'green',
  [ReservationStatus.Pending]: 'yellow',
  [ReservationStatus.CheckedIn]: 'green',
  [ReservationStatus.Cleared]: 'red',
};

gql`
  fragment ReservationFragment on Reservation {
    id
    token
    startTime
    endTime
    table {
      maxCapacity
      area {
        displayName
      }
    }
    status
  }
`;

export default function Reservation({
  data,
}: {
  data: ReservationFragmentFragment;
}) {
  return (
    <Box boxShadow="sm" padding="2" background="white" borderRadius="lg">
      {data.startTime.toLocaleString('de', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}{' '}
      bis{' '}
      {data.endTime.toLocaleTimeString('de', {
        hour: '2-digit',
        minute: '2-digit',
      })}{' '}
      Uhr
      <br />
      Tisch für {data.table.maxCapacity} Personen
      <br />
      {data.table.area.displayName}
      <br />
      <Badge colorScheme={RESERVATION_COLOR[data.status]}>
        {RESERVATION_STATUS[data.status]}
      </Badge>
      <br />
      <Button colorScheme="red" size="sm">
        Absagen
      </Button>
    </Box>
  );
}
