import {SlotsQuery} from '../types/graphql';
import React from 'react';
import {Badge, Box, Text} from '@chakra-ui/react';
import Link from 'next/link';
import {WarningTwoIcon} from '@chakra-ui/icons';

export default function Slot({
  data,
  partySize,
}: {
  data: NonNullable<
    NonNullable<SlotsQuery['areas']>[number]
  >['reservationSlot'][number];
  partySize: number;
}) {
  // if (
  //   !data.slotAvailability?.available &&
  //   !(
  //     data.slotAvailability?.availabilityForSmallerPartySize ||
  //     data.slotAvailability?.availabilityForLargerPartySize
  //   )
  // ) {
  //   return null;
  // }

  const box = (
    <Box
      boxShadow="base"
      borderRadius="lg"
      cursor={data.slotAvailability?.available ? 'pointer' : 'not-allowed'}
      padding="1"
      backgroundColor={
        data.slotAvailability?.available ? 'white' : 'orange.100'
      }
      width="100%"
    >
      <Badge
        colorScheme={data.slotAvailability?.available ? undefined : 'orange'}
      >
        {data.startTime.toLocaleTimeString('de', {
          timeStyle: 'short',
        })}
        &nbsp;Uhr
      </Badge>
      <br />
      {data.slotAvailability?.availabilityForSmallerPartySize && (
        <Text>
          <WarningTwoIcon />
          Tisch für {
            data.slotAvailability?.availabilityForSmallerPartySize
          }{' '}
          Personen
        </Text>
      )}
      {data.slotAvailability?.availabilityForLargerPartySize && (
        <Text>
          <WarningTwoIcon />
          Tisch für {data.slotAvailability?.availabilityForLargerPartySize}{' '}
          Personen
        </Text>
      )}
      <br />
      <Badge
        colorScheme={data.slotAvailability?.available ? undefined : 'orange'}
      >
        {data.endTime.toLocaleTimeString('de', {
          timeStyle: 'short',
        })}
        &nbsp;Uhr
      </Badge>
    </Box>
  );

  if (data.slotAvailability?.available === true) {
    return <Link href={`/slot/${data.id}?partySize=${partySize}`}>{box}</Link>;
  }

  return box;
}
