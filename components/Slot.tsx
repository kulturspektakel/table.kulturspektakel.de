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
  const {
    available,
    availabilityForSmallerPartySize,
    availabilityForLargerPartySize,
  } = data.slotAvailability;
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
      cursor={available ? 'pointer' : 'not-allowed'}
      padding="1"
      backgroundColor={available ? 'white' : 'orange.100'}
      width="100%"
    >
      <Badge colorScheme={available ? undefined : 'orange'}>
        {data.startTime.toLocaleTimeString('de', {
          timeStyle: 'short',
        })}
        &nbsp;Uhr
      </Badge>
      <br />
      {availabilityForSmallerPartySize && (
        <Text>
          <WarningTwoIcon />
          Tisch für {availabilityForSmallerPartySize} Personen
        </Text>
      )}
      {availabilityForLargerPartySize && (
        <Text>
          <WarningTwoIcon />
          Tisch für {availabilityForLargerPartySize} Personen
        </Text>
      )}
      <br />
      <Badge colorScheme={available ? undefined : 'orange'}>
        {data.endTime.toLocaleTimeString('de', {
          timeStyle: 'short',
        })}
        &nbsp;Uhr
      </Badge>
    </Box>
  );

  if (available === true) {
    return <Link href={`/slot/${data.id}?partySize=${partySize}`}>{box}</Link>;
  }

  return box;
}
