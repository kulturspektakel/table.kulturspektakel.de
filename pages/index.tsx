import {Stack, Select, VStack} from '@chakra-ui/react';
import React, {useState} from 'react';
import Slots from '../components/Slots';
import {formatISO, isSameDay, parseISO} from 'date-fns';
import Page from '../components/Page';

const DATES = [
  new Date('2021-07-23'),
  new Date('2021-07-24'),
  new Date('2021-07-25'),
];

export default function Home() {
  const [partySize, setPartySize] = useState(4);
  const defaultDate = DATES.find((d) => isSameDay(d, new Date())) ?? DATES[0];
  const [startTime, setStartTime] = useState(defaultDate);

  return (
    <Page>
      <VStack spacing="10">
        <Stack spacing={['3', '10']} direction={['column', 'row']} width="100%">
          <Select
            fontWeight="semibold"
            backgroundColor="white"
            value={formatISO(startTime, {
              representation: 'date',
            })}
            onChange={(e) => setStartTime(parseISO(e.target.value))}
          >
            {DATES.map((d, i) => (
              <option key={i} value={formatISO(d, {representation: 'date'})}>
                {d.toLocaleDateString('de', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'Europe/Berlin',
                })}
              </option>
            ))}
          </Select>
          <Select
            fontWeight="semibold"
            backgroundColor="white"
            value={partySize}
            onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
          >
            {Array.from(Array(9)).map((_, i) => (
              <option key={i} value={i + 2}>
                {i + 2} Personen
              </option>
            ))}
          </Select>
        </Stack>
        <Slots day={startTime} partySize={partySize} />
      </VStack>
    </Page>
  );
}
