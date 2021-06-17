import {gql} from '@apollo/client';
import {
  Select,
  Table,
  Td,
  Th,
  Tr,
  Button,
  Tbody,
  Box,
  Input,
  VStack,
  Text,
  Heading,
} from '@chakra-ui/react';
import {
  differenceInMinutes,
  add,
  formatISO,
  parseISO,
  max,
  isAfter,
  isBefore,
} from 'date-fns';
import {NextPageContext} from 'next';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Page from '../../../../components/Page';
import {STEP_MINUTES} from '../../../../components/Slots';
import TableTypeSelector from '../../../../components/TableTypeSelector';
import useErrorDialog from '../../../../components/useErrorDialog';
import {
  useRequestMutation,
  useAreaNameQuery,
  TableType,
} from '../../../../types/graphql';

const MIN_DURATION_MINUTES = 90;
const MAX_DURATION_MINUTES = 240;

gql`
  mutation Request(
    $areaId: ID!
    $endTime: DateTime!
    $startTime: DateTime!
    $primaryPerson: String!
    $primaryEmail: String!
    $otherPersons: [String!]!
    $tableType: TableType
  ) {
    requestReservation(
      areaId: $areaId
      endTime: $endTime
      startTime: $startTime
      primaryPerson: $primaryPerson
      primaryEmail: $primaryEmail
      otherPersons: $otherPersons
      tableType: $tableType
    )
  }
`;

gql`
  query AreaName($id: ID!, $day: Date!, $partySize: Int!) {
    node(id: $id) {
      ... on Area {
        displayName
        availability(day: $day, partySize: $partySize) {
          startTime
          endTime
          tableType
        }
      }
    }
  }
`;

type Props = {
  startTime: number;
  partySize: number;
  areaId: string;
};

function Booking({areaId, partySize, ...props}: Props) {
  const startTime = new Date(props.startTime);
  const {data} = useAreaNameQuery({
    variables: {
      id: `Area:${areaId}`,
      partySize,
      day: startTime,
    },
  });

  const earliestEnd = add(startTime, {minutes: MIN_DURATION_MINUTES});
  const availability =
    data?.node?.availability.filter(
      ({startTime: s, endTime}) =>
        !isAfter(s, startTime) && !isBefore(endTime, earliestEnd),
    ) ?? [];
  const maxEndTime =
    availability.length > 0
      ? max(availability.map(({endTime}) => endTime))
      : startTime;

  const [endTime, setEndTime] = useState<Date | null>(null);
  const [primaryPerson, setPrimaryPerson] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [prefersIsland, setPrefersIsland] = useState<boolean | null>(null);
  const [otherPersons, setOtherPersons] = useState<string[]>(
    Array.from(Array(partySize - 1)).map(() => ''),
  );
  const [requestReservation, {loading, error, data: requestData}] =
    useRequestMutation({
      variables: {
        areaId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        endTime: endTime!,
        otherPersons,
        primaryEmail,
        primaryPerson,
        startTime,
        tableType: prefersIsland ? TableType.Island : undefined,
      },
      errorPolicy: 'all',
    });

  const errorDialog = useErrorDialog(error);
  const router = useRouter();
  useEffect(() => {
    if (requestData?.requestReservation) {
      router.push('/confirm');
    }
  }, [requestData, router]);

  const steps =
    Math.floor(
      Math.min(
        MAX_DURATION_MINUTES - MIN_DURATION_MINUTES,
        differenceInMinutes(maxEndTime, earliestEnd),
      ) / STEP_MINUTES,
    ) + 1;

  const hasTableTypeChoice =
    areaId === 'gb' &&
    availability.some(({tableType}) => tableType === TableType.Island) &&
    availability.some(({tableType}) => tableType !== TableType.Island);

  const submitDisabled =
    !endTime ||
    !primaryPerson ||
    !primaryEmail ||
    otherPersons.some((p) => !p) ||
    (hasTableTypeChoice && prefersIsland == null);

  return (
    <Page loading={data?.node == null || availability.length === 0}>
      {errorDialog}
      <Box boxShadow="sm" bg="white" borderRadius="md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!submitDisabled) {
              requestReservation();
            }
          }}
        >
          <Table size="md">
            <Tbody>
              <Tr>
                <Th pr="0" isNumeric>
                  Tag
                </Th>
                <Td fontWeight="semibold">
                  {startTime.toLocaleDateString('de', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: 'Europe/Berlin',
                  })}
                  &nbsp;Uhr
                </Td>
              </Tr>
              <Tr>
                <Th pr="0" isNumeric>
                  bis
                </Th>
                <Td fontWeight="semibold">
                  {steps < 2 ? (
                    renderTime(maxEndTime)
                  ) : (
                    <Select
                      backgroundColor="white"
                      value={endTime ? formatISO(endTime) : 'null'}
                      onChange={(e) => setEndTime(parseISO(e.target.value))}
                      color={endTime == null ? 'gray.400' : undefined}
                    >
                      {endTime == null && (
                        <option
                          value="null"
                          disabled
                          style={{color: '#A0AEC0'}}
                        >
                          bitte auswählen...
                        </option>
                      )}
                      {Array.from(Array(steps)).map((_, i) => {
                        const date = add(earliestEnd, {
                          minutes: i * STEP_MINUTES,
                        });
                        return (
                          <option
                            key={i}
                            value={formatISO(date)}
                            style={{color: 'black'}}
                          >
                            {renderTime(date)}
                          </option>
                        );
                      })}
                    </Select>
                  )}
                </Td>
              </Tr>
              <Tr>
                <Th minH="64px" pr="0" isNumeric>
                  Bereich
                </Th>
                <Td fontWeight="semibold">{data?.node?.displayName ?? ''}</Td>
              </Tr>
              <Tr>
                <Th pr="0" isNumeric>
                  Name
                </Th>
                <Td fontWeight="semibold">
                  <Input
                    autoComplete="name"
                    placeholder="Dein Name"
                    onChange={(e) => setPrimaryPerson(e.target.value)}
                  />
                </Td>
              </Tr>
              <Tr>
                <Th pr="0" isNumeric>
                  E-Mail
                </Th>
                <Td fontWeight="semibold">
                  <Input
                    placeholder="Deine E-Mail-Adresse"
                    type="email"
                    autoComplete="home email"
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                  />
                </Td>
              </Tr>
              <Tr>
                <Th pr="0" pt="5" verticalAlign="top" isNumeric>
                  Weitere
                  <br />
                  Gäste
                </Th>
                <Td fontWeight="semibold">
                  <VStack>
                    {Array.from(Array(partySize - 1)).map((_, i) => (
                      <Input
                        key={i}
                        autoComplete="off"
                        placeholder="Name"
                        onChange={(e) => {
                          const newPersons = [...otherPersons];
                          newPersons[i] = e.target.value;
                          setOtherPersons(newPersons);
                        }}
                      />
                    ))}
                  </VStack>
                  <Text
                    mt="2"
                    fontSize="md"
                    fontWeight="normal"
                    color="gray.500"
                    textAlign="left"
                    maxW="400px"
                  >
                    Kleinkinder die keinen eigenen Sitzplatz benötigen, müssen
                    nicht eingetragen werden.
                  </Text>
                </Td>
              </Tr>
              {hasTableTypeChoice && (
                <Tr>
                  <Td colSpan={2}>
                    <Heading
                      size="xs"
                      mb="2"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      color="gray.600"
                      textAlign="center"
                    >
                      Sitzplatz auswählen
                    </Heading>
                    <TableTypeSelector onChange={setPrefersIsland} />
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          <Box p="5">
            <Button
              type="submit"
              colorScheme="blue"
              isFullWidth
              isLoading={loading}
              isDisabled={submitDisabled}
            >
              Reservieren
            </Button>
          </Box>
        </form>
      </Box>
    </Page>
  );
}

function renderTime(date: Date): string {
  return (
    date.toLocaleTimeString('de', {
      minute: '2-digit',
      hour: '2-digit',
      timeZone: 'Europe/Berlin',
    }) + ' Uhr'
  );
}

Booking.getInitialProps = ({query}: NextPageContext): Props => {
  const {startTime, partySize, areaId} = query;

  return {
    startTime: parseInt(String(startTime), 10),
    partySize: parseInt(String(partySize), 10),
    areaId: String(areaId),
  };
};

export default Booking;
