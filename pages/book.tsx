import {gql} from '@apollo/client';
import {Select, Table, Td, Th, Tr, Button, Tbody} from '@chakra-ui/react';
import {differenceInMinutes, add, formatISO, parseISO} from 'date-fns';
import {GetServerSideProps} from 'next';
import React, {useState} from 'react';
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
  const [endTime, setEndTime] = useState(maxEndTime);
  const [requestReservation, {loading, error}] = useRequestMutation({
    variables: {
      areaId,
      endTime,
      otherPersons: [],
      primaryEmail: '',
      primaryPerson: '',
      startTime,
    },
    errorPolicy: 'all',
  });
  const errorDialog = useErrorDialog(error);

  const earliestEnd = add(startTime, {minutes: MIN_DURATION_MINUTES});
  const steps = Math.floor(
    Math.min(
      MAX_DURATION_MINUTES - MIN_DURATION_MINUTES,
      differenceInMinutes(maxEndTime, earliestEnd),
    ) / STEP_MINUTES,
  );

  return (
    <Page>
      {errorDialog}
      <Table>
        <Tbody>
          <Tr>
            <Th isNumeric>Tag</Th>
            <Td fontWeight="semibold">
              {startTime.toLocaleDateString('de', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Td>
          </Tr>
          <Tr>
            <Th isNumeric>Bereich</Th>
            <Td fontWeight="semibold">{area}</Td>
          </Tr>
          <Tr>
            <Th isNumeric>Gäste</Th>
            <Td fontWeight="semibold">{partySize} Personen</Td>
          </Tr>
          <Tr>
            <Th isNumeric>von</Th>
            <Td fontWeight="semibold">{renderTime(startTime)}</Td>
          </Tr>
          <Tr>
            <Th isNumeric>bis</Th>
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
        </Tbody>
      </Table>
      <Button
        colorScheme="blue"
        isFullWidth
        isLoading={loading}
        onClick={() => requestReservation({})}
      >
        Reservieren
      </Button>
    </Page>
  );
}

function renderTime(date: Date): string {
  return (
    date.toLocaleTimeString('de', {
      minute: '2-digit',
      hour: '2-digit',
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
