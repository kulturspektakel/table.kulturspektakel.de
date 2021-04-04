import {SlotsQuery, useSlotsQuery} from '../types/graphql';
import React from 'react';
import {gql} from '@apollo/client';
import Slot from './Slot';
import {Spinner} from '@chakra-ui/react';
import {isSameDay} from 'date-fns';

gql`
  query Slots($partySize: Int!) {
    areas {
      id
      displayName
      reservationSlot(orderBy: {startTime: asc}) {
        id
        startTime
        endTime
        slotAvailability(partySize: $partySize) {
          available
          availabilityForSmallerPartySize
          availabilityForLargerPartySize
        }
      }
    }
  }
`;

export default function Slots(props: {day: Date; partySize: number}) {
  const {data, loading} = useSlotsQuery({
    variables: {
      partySize: props.partySize,
    },
  });

  if (loading) {
    return <Spinner />;
  }
  return (
    <ul>
      {data?.areas?.map((area) => (
        <li>
          {area.displayName}
          <ul>
            {area.reservationSlot
              .filter((slot) => isSameDay(new Date(slot.startTime), props.day))
              .map((slot) => (
                <Slot data={slot} key={slot.id} />
              ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
