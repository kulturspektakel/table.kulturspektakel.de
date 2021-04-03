import {SlotFragment} from '../types/graphql';
import React from 'react';
import {gql} from '@apollo/client';
import styles from './Slot.module.css';

gql`
  fragment Slot on SlotAvailability {
    available
    availabilityForSmallerPartySize
    availabilityForLargerPartySize
    reservationSlot {
      id
      startTime
      endTime
    }
  }
`;

export default function Slot({data}: {data: SlotFragment}) {
  return (
    <li className={styles.slot}>
      start: {new Date(data.reservationSlot.startTime).toLocaleTimeString()}
      <br />
      end: {new Date(data.reservationSlot.endTime).toLocaleTimeString()}
      <br />
      available: {data.available ? 'true' : 'false'}
    </li>
  );
}
