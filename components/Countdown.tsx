import React, {useEffect, useState} from 'react';
import {differenceInSeconds} from 'date-fns';
import {Text, Box, HStack, VStack} from '@chakra-ui/react';
import {WarningTwoIcon} from '@chakra-ui/icons';

export default function Countdown(props: {date: Date; children: any}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const ref = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(ref);
  }, [setNow]);

  if (!now) {
    return null;
  }
  const diff = differenceInSeconds(props.date, now);
  const seconds = diff % 60;
  const minutes = Math.floor(diff / 60) % 60;
  const hours = Math.floor(diff / 3600) % 24;
  const days = Math.floor(diff / 86400);

  return diff < 0 ? (
    props.children
  ) : (
    <VStack
      maxWidth="400px"
      w="100%"
      borderRadius="lg"
      backgroundColor="white"
      p="3"
      boxShadow="sm"
    >
      <Text textAlign="center" lineHeight="short" mb="3" fontWeight="semibold">
        <WarningTwoIcon color="yellow.500" pb="2" boxSize="8" />
        <br />
        Die Tischreservierung startet am
        <br />
        {props.date.toLocaleString('de-DE', {
          day: '2-digit',
          month: 'long',
          weekday: 'long',
          minute: '2-digit',
          hour: '2-digit',
          timeZone: 'Europe/Berlin',
        })}{' '}
        Uhr
      </Text>
      <HStack w="100%">
        {days > 0 && (
          <Box textAlign="center" flexGrow={1} flexBasis={0}>
            <Text fontWeight="semibold" fontSize="2xl">
              {Math.max(0, days)}
            </Text>
            <Text fontWeight="semibold" color="gray.500">
              Tage
            </Text>
          </Box>
        )}
        <Box textAlign="center" flexGrow={1} flexBasis={0}>
          <Text fontWeight="semibold" fontSize="2xl">
            {Math.max(0, hours)}
          </Text>
          <Text fontWeight="semibold" color="gray.500">
            Stunden
          </Text>
        </Box>
        <Box textAlign="center" flexGrow={1} flexBasis={0}>
          <Text fontWeight="semibold" fontSize="2xl">
            {Math.max(0, minutes)}
          </Text>
          <Text fontWeight="semibold" color="gray.500">
            Minuten
          </Text>
        </Box>
        <Box textAlign="center" flexGrow={1} flexBasis={0}>
          <Text fontWeight="semibold" fontSize="2xl">
            {Math.max(0, seconds)}
          </Text>
          <Text fontWeight="semibold" color="gray.500">
            Sekunden
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
}
