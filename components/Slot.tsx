import {SlotsQuery} from '../types/graphql';
import React from 'react';
import {Badge, Box, Flex, HStack, Spacer, Text} from '@chakra-ui/react';
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

  let content = null;
  if (availabilityForSmallerPartySize) {
    content = (
      <Badge colorScheme="yellow" variant="outline">
        max. {availabilityForSmallerPartySize} Personen
      </Badge>
    );
  } else if (availabilityForLargerPartySize) {
    content = (
      <Badge colorScheme="yellow" variant="outline">
        mind. {availabilityForSmallerPartySize} Personen
      </Badge>
    );
  } else if (!available) {
    content = (
      <Badge colorScheme="red" variant="outline">
        belegt
      </Badge>
    );
  } else {
    content = (
      <>
        <Badge colorScheme="green">frei</Badge>
        {data.bandsPlaying.length > 0 && (
          <>
            <Text fontWeight="500" pt="1">
              Bands:
            </Text>
            {data.bandsPlaying.map((band) => (
              <Text key={band.id}>
                {band.name} ({band.genre})
              </Text>
            ))}
          </>
        )}
      </>
    );
  }

  const box = (
    <Box
      boxShadow={available ? 'base' : 'none'}
      backgroundColor={available ? 'white' : 'gray.50'}
      cursor={available ? 'pointer' : 'not-allowed'}
      borderColor={available ? 'transparent' : 'gray.300'}
      transition=".2s ease-out box-shadow"
      borderRadius="lg"
      borderWidth="1px"
      p="2"
      h="100%"
      _hover={{
        boxShadow: available ? 'md' : 'none',
      }}
    >
      <Flex direction="column" minH="10" h="100%">
        <Text textColor="gray.600">
          {data.startTime.toLocaleTimeString('de', {
            timeStyle: 'short',
          })}
          &nbsp;Uhr
        </Text>
        <Box flexGrow={1} pt="3" pb="3">
          {content}
        </Box>
        <Text textColor="gray.600">
          {data.endTime.toLocaleTimeString('de', {
            timeStyle: 'short',
          })}
          &nbsp;Uhr
        </Text>
      </Flex>
    </Box>
  );

  if (available === true) {
    return <Link href={`/slot/${data.id}?partySize=${partySize}`}>{box}</Link>;
  }

  return box;
}
