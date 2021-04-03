import {useSlotsQuery} from '../types/graphql';
import React from 'react';
import {gql} from '@apollo/client';
import Slot from './Slot';

gql`
  query Slots($date: Date!, $partySize: Int!) {
    areas {
      id
      displayName
      reservableSlots(date: $date, partySize: $partySize) {
        ...Slot
      }
    }
  }
`;

export default function Slots(props: {day: string; partySize: number}) {
  const {data} = useSlotsQuery({
    variables: {
      date: props.day,
      partySize: props.partySize,
    },
  });
  return (
    <ul>
      {data?.areas?.map((area) => (
        <li>
          {area.displayName}
          <ul>
            {area.reservableSlots.map((slot) => (
              <Slot data={slot} key={slot.reservationSlot.id} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
