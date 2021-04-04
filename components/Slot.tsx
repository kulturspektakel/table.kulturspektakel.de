import {SlotsQuery} from '../types/graphql';
import React from 'react';
import styles from './Slot.module.css';
import {Box} from '@chakra-ui/react';
import Link from 'next/link';

export type SlotProps = SlotsQuery['areas'][number]['reservationSlot'][number];

export default function Slot({data}: {data: SlotProps}) {
  return (
    <Link href={`/slot/${data.id}`}>
      <Box borderRadius="lg" borderWidth="1px" className={styles.slot}>
        start: {new Date(data.startTime).toLocaleTimeString()}
        <br />
        end: {new Date(data.endTime).toLocaleTimeString()}
        <br />
        available: {data.slotAvailability?.available ? 'true' : 'false'}
      </Box>
    </Link>
  );
}
