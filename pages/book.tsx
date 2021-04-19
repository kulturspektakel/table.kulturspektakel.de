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
} from '@chakra-ui/react';
import {differenceInMinutes, add, formatISO, parseISO} from 'date-fns';
import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Page from '../components/Page';
import {STEP_MINUTES} from '../components/Slots';
import useErrorDialog from '../components/useErrorDialog';
import {useRequestMutation} from '../types/graphql';

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
  ) {
    requestReservation(
      areaId: $areaId
      endTime: $endTime
      startTime: $startTime
      primaryPerson: $primaryPerson
      primaryEmail: $primaryEmail
      otherPersons: $otherPersons
    )
  }
`;

export type Props = {
  startTime: number;
  endTime: number;
  partySize: number;
  areaId: string;
  area: string;
};

export default function Booking({
  startTime: s,
  endTime: e,
  partySize,
  areaId,
  area,
}: Props) {
  const startTime = new Date(s);
  const maxEndTime = new Date(e);
  const earliestEnd = add(startTime, {minutes: MIN_DURATION_MINUTES});
  const [endTime, setEndTime] = useState(earliestEnd);
  const [primaryPerson, setPrimaryPerson] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [otherPersons, setOtherPersons] = useState<string[]>(
    Array.from(Array(partySize - 1)).map((_) => ''),
  );
  const [requestReservation, {loading, error, data}] = useRequestMutation({
    variables: {
      areaId,
      endTime,
      otherPersons,
      primaryEmail,
      primaryPerson,
      startTime,
    },
    errorPolicy: 'all',
  });
  const errorDialog = useErrorDialog(error);
  const router = useRouter();
  useEffect(() => {
    if (data?.requestReservation) {
      router.push('/confirm');
    }
  }, [data, router]);

  const steps =
    Math.floor(
      Math.min(
        MAX_DURATION_MINUTES - MIN_DURATION_MINUTES,
        differenceInMinutes(maxEndTime, earliestEnd),
      ) / STEP_MINUTES,
    ) + 1;

  const submitDisabled =
    !primaryPerson || !primaryEmail || otherPersons.some((p) => !p);

  return (
    <Page>
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
                  })}{' '}
                  Uhr
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
                      fontWeight="semibold"
                      backgroundColor="white"
                      value={formatISO(endTime)}
                      onChange={(e) => setEndTime(parseISO(e.target.value))}
                    >
                      {Array.from(Array(steps)).map((_, i) => {
                        const date = add(earliestEnd, {
                          minutes: i * STEP_MINUTES,
                        });
                        return (
                          <option key={i} value={formatISO(date)}>
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
                <Td fontWeight="semibold">{area}</Td>
              </Tr>
              <Tr>
                <Th pr="0" isNumeric>
                  Name
                </Th>
                <Td fontWeight="semibold">
                  <Input
                    autoComplete="name"
                    placeholder="Deine Name"
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
                <Th pr="0" pt="6" verticalAlign="top" isNumeric>
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
                </Td>
              </Tr>
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

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const {startTime, endTime, partySize, areaId, area} = context.query;
  if (!startTime || !endTime || !partySize || !areaId || !area) {
    const props: any = undefined;
    return {
      redirect: {
        destination: '/',
      },
      props,
    };
  }

  return {
    props: {
      startTime: parseInt(String(startTime), 10),
      endTime: parseInt(String(endTime), 10),
      partySize: parseInt(String(partySize), 10),
      areaId: String(areaId),
      area: String(area),
    },
  };
};
