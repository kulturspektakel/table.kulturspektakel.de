import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {
  Badge,
  Box,
  Center,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Text,
  Td,
  Th,
  Tr,
  VStack,
  Button,
  Input,
  Link as ChakraLink,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import {gql} from '@apollo/client';
import {
  ReservationStatus,
  useConfimReservationMutation,
  useReservationQuery,
} from '../../types/graphql';
import Page from '../../components/Page';
import Link from 'next/link';
import CancelButton from '../../components/CancelButton';
import GuestList from '../../components/GuestList';
import {ChevronRightIcon, WarningTwoIcon} from '@chakra-ui/icons';
import Head from 'next/head';

gql`
  query Reservation($token: String!) {
    reservationForToken(token: $token) {
      id
      token
      startTime
      endTime
      table {
        maxCapacity
        area {
          displayName
        }
      }
      status
      primaryPerson
      otherPersons
      reservationsFromSamePerson {
        id
        token
        startTime
      }
    }
  }

  mutation ConfimReservation($token: String!) {
    confirmReservation(token: $token) {
      id
      status
      reservationsFromSamePerson {
        id
        token
        startTime
      }
    }
  }
`;

const RESERVATION_STATUS: Record<ReservationStatus, string> = {
  [ReservationStatus.Confirmed]: 'Bestätigt',
  [ReservationStatus.Pending]: 'Unbestätigt',
  [ReservationStatus.CheckedIn]: 'Eingecheckt',
};

const RESERVATION_COLOR: Record<ReservationStatus, string> = {
  [ReservationStatus.Confirmed]: 'green',
  [ReservationStatus.Pending]: 'yellow',
  [ReservationStatus.CheckedIn]: 'green',
};

export default function Reservations() {
  const {query} = useRouter();
  const token = String(query.token);
  const {data, loading} = useReservationQuery({variables: {token}});
  const reservation = data?.reservationForToken;

  const [confirmReservation] = useConfimReservationMutation({
    variables: {token},
  });

  useEffect(() => {
    if (reservation?.status === ReservationStatus.Pending) {
      confirmReservation();
    }
  }, [confirmReservation, reservation]);

  return (
    <Page>
      {!reservation && loading && (
        <Center>
          <Spinner />
        </Center>
      )}
      {!reservation && !loading && (
        <Center flexDirection="column">
          <WarningTwoIcon boxSize="6" color="yellow.500" mt="6" />
          <Heading mt="2" mb="6" size="sm">
            Reservierung nicht vorhanden
          </Heading>
          <Link href="/">
            <Button colorScheme="green" size="sm">
              Neue Reservierung
            </Button>
          </Link>
        </Center>
      )}
      {reservation && (
        <VStack spacing="3" alignItems="stretch">
          <Head>
            <title>
              Reservierung #{reservation.id} · Kulturspektakel Gauting
            </title>
          </Head>
          <Heading size="md" textAlign="center"></Heading>
          <Box boxShadow="sm" bgColor="white" borderRadius="lg" p="5">
            <Heading size="sm" mb="1">
              Wichtige Informationen
            </Heading>
            <UnorderedList spacing={1} pl="2">
              <ListItem>
                Der Zugang zum Festival ist ausschließlich über einen der{' '}
                <ChakraLink
                  color="red.500"
                  fontWeight="semibold"
                  isExternal
                  href="https://kulturspektakel.de/angebot"
                >
                  beiden Eingänge
                </ChakraLink>{' '}
                möglich.
              </ListItem>
              <ListItem>
                Bitte seid pünktlich zum Beginn eurer Reservierung da, sonst
                verfällt sie.
              </ListItem>
              <ListItem>
                Am Einlass werden die Kontaktdaten aller Gäste erfasst -
                entweder via Check-In bei darfichrein.de mit eurem Smartphone
                oder über ein Formular zur Gästeregistrierung
              </ListItem>
              <ListItem>
                Außer auf den Wegen zu den Verkaufsständen und Toiletten dürft
                ihr euch nur an eurem Sitzplatz aufhalten und nicht an andere
                Tische wechseln.
              </ListItem>
              <ListItem>
                Unser Hygienekonzept findet ihr auf{' '}
                <ChakraLink
                  color="red.500"
                  fontWeight="semibold"
                  isExternal
                  href="https://kulturspektakel.de/hygiene/"
                >
                  kulturspektakel.de/hygiene
                </ChakraLink>
              </ListItem>
            </UnorderedList>
          </Box>
          <Box boxShadow="sm" bgColor="white" borderRadius="lg">
            <Table size="md">
              <Tbody>
                <Tr>
                  <Th pr="0" isNumeric>
                    Tag
                  </Th>
                  <Td fontWeight="semibold">
                    {reservation.startTime.toLocaleDateString('de', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'Europe/Berlin',
                    })}
                  </Td>
                </Tr>
                <Tr>
                  <Th pr="0" isNumeric>
                    Uhrzeit
                  </Th>
                  <Td fontWeight="semibold">
                    {reservation.startTime.toLocaleTimeString('de', {
                      minute: '2-digit',
                      hour: '2-digit',
                      timeZone: 'Europe/Berlin',
                    })}{' '}
                    bis{' '}
                    {reservation.endTime.toLocaleTimeString('de', {
                      minute: '2-digit',
                      hour: '2-digit',
                      timeZone: 'Europe/Berlin',
                    })}{' '}
                    Uhr
                  </Td>
                </Tr>
                <Tr>
                  <Th minH="64px" pr="0" isNumeric>
                    Bereich
                  </Th>
                  <Td fontWeight="semibold">
                    {reservation.table.area.displayName}
                  </Td>
                </Tr>
                <Tr>
                  <Th pr="0" isNumeric>
                    Status
                  </Th>
                  <Td fontWeight="semibold">
                    <Badge colorScheme={RESERVATION_COLOR[reservation.status]}>
                      {RESERVATION_STATUS[reservation.status]}
                    </Badge>
                  </Td>
                </Tr>
                <Tr>
                  <Th pr="0" pt="6" verticalAlign="top" isNumeric>
                    Gäste
                  </Th>
                  <Td>
                    <Input
                      value={reservation.primaryPerson}
                      style={{opacity: 1}}
                      bgColor="gray.50"
                      disabled
                      mb="2"
                    />
                    <GuestList
                      maxCapacity={reservation.table.maxCapacity}
                      initialOtherPersons={reservation.otherPersons}
                      token={reservation.token}
                      canEdit={reservation.status === 'Confirmed'}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <HStack p="5">
              <Link
                href={`https://api.kulturspektakel.de/passkit/${reservation.token}`}
              >
                <a>
                  <img src="/apple-wallet.svg" />
                </a>
              </Link>
              <Link
                href={`https://api.kulturspektakel.de/ics/${reservation.token}`}
              >
                <a>
                  <img src="/calendar.svg" />
                </a>
              </Link>
              <Spacer />
              {reservation.status === 'Confirmed' && (
                <CancelButton token={reservation.token} />
              )}
            </HStack>
          </Box>
          {reservation.reservationsFromSamePerson.length > 0 && (
            <>
              <Heading size="md" textAlign="center" pt="8">
                Weitere Reservierungen
              </Heading>
              {reservation.reservationsFromSamePerson.map((r) => (
                <Link href={`/reservation/${r.token}`} key={r.id}>
                  <Box
                    cursor="pointer"
                    key={r.id}
                    boxShadow="sm"
                    bgColor="white"
                    borderRadius="lg"
                    p="5"
                  >
                    <HStack>
                      <VStack spacing="0" alignItems="flex-start">
                        <Heading size="sm">Reservierung #{r.id}</Heading>
                        <Text>
                          {r.startTime.toLocaleString('de', {
                            day: '2-digit',
                            month: 'long',
                            weekday: 'long',
                            minute: '2-digit',
                            hour: '2-digit',
                            timeZone: 'Europe/Berlin',
                          })}{' '}
                          Uhr
                        </Text>
                      </VStack>
                      <Spacer />
                      <ChevronRightIcon boxSize="6" color="gray.400" />
                    </HStack>
                  </Box>
                </Link>
              ))}
            </>
          )}
        </VStack>
      )}
    </Page>
  );
}
