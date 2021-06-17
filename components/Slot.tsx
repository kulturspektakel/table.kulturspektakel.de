import {BandPopoverFragment} from '../types/graphql';
import React from 'react';
import {
  Center,
  Text,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverBody,
  PopoverArrow,
  Box,
  useMediaQuery,
  Circle,
} from '@chakra-ui/react';
import Link from 'next/link';
import {gql} from '@apollo/client';

export function SlotLink({
  startTime,
  endTime,
  partySize,
  area,
  children,
}: {
  startTime: Date;
  endTime: Date | null;
  area: {
    id: string;
    displayName: string;
  };
  partySize: number;
  children: JSX.Element;
}) {
  if (!endTime) {
    return children;
  }

  return (
    <Link href={`/book/${area.id}/${partySize}/${startTime.getTime()}`}>
      <Box w="100%">{children}</Box>
    </Link>
  );
}

gql`
  fragment BandPopover on Band {
    name
    genre
  }
`;

export function SlotPopover({
  children,
  band,
}: {
  children: JSX.Element;
  band?: BandPopoverFragment;
}) {
  const [small, touch] = useMediaQuery([
    '(max-width: 500px)',
    '(pointer: coarse)',
  ]);
  if (!band || touch || small) {
    return children;
  }

  return (
    <Box position="relative" w="100%">
      <Popover
        trigger={touch ? 'click' : 'hover'}
        placement="right-start"
        isLazy
      >
        <PopoverTrigger>
          <Circle
            userSelect="none"
            size="5"
            position="absolute"
            right="-2px"
            top="-2px"
            fontSize="13"
            bgColor="gray.300"
          >
            ♫
          </Circle>
        </PopoverTrigger>
        <PopoverContent
          bg="gray.900"
          color="white"
          borderColor="gray.900"
          fontSize="sm"
        >
          <PopoverArrow bg="gray.900" />
          <PopoverBody>
            <Text>
              <strong>{band.name}</strong>
              {band.genre && <> ({band.genre})</>}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      {children}
    </Box>
  );
}

export function SlotContent({
  time,
  available,
  open,
}: {
  time: Date;
  available: boolean;
  open: boolean;
}) {
  return (
    <Center
      h="40px"
      w="100%"
      key={time.toString()}
      borderColor="gray.200"
      backgroundColor={available ? 'white' : undefined}
      borderRadius="lg"
      flexDirection="column"
      boxShadow={available ? 'sm' : undefined}
      borderWidth={open && !available ? 1 : 0}
      cursor={available ? 'pointer' : open ? 'not-allowed' : 'default'}
      transition=".2s ease-out box-shadow"
      lineHeight="1"
      _hover={{
        boxShadow: available ? 'md' : 'none',
      }}
    >
      <Text>
        {available &&
          time.toLocaleTimeString('de', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Berlin',
          })}
      </Text>
    </Center>
  );
}
