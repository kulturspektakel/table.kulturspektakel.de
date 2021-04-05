import {Badge, Box, Button} from '@chakra-ui/react';
import React from 'react';
import {ReservationQuery, ReservationStatus} from '../types/graphql';

const RESERVATION_STATUS: Record<ReservationStatus, string> = {
  [ReservationStatus.Reserved]: 'Bestätigt',
  [ReservationStatus.Pending]: 'Unbestätigt',
  [ReservationStatus.CheckedIn]: 'Eingechekt',
  [ReservationStatus.Cleared]: 'abgesagt',
};

const RESERVATION_COLOR: Record<ReservationStatus, string> = {
  [ReservationStatus.Reserved]: 'green',
  [ReservationStatus.Pending]: 'yellow',
  [ReservationStatus.CheckedIn]: 'green',
  [ReservationStatus.Cleared]: 'red',
};

export default function Reservation({
  data,
}: {
  data: ReservationQuery['reservationsForToken'][number];
}) {
  const slot = data.reservationSlots[0];
  const lastSlot = data.reservationSlots[data.reservationSlots.length - 1];
  return (
    <Box boxShadow="sm" padding="2" background="white" borderRadius="lg">
      {slot.startTime.toLocaleString('de', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}{' '}
      bis{' '}
      {lastSlot.endTime.toLocaleTimeString('de', {
        hour: '2-digit',
        minute: '2-digit',
      })}{' '}
      Uhr
      <br />
      {slot.area.displayName}
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
