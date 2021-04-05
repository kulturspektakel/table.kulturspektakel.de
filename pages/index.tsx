import {HStack, Select, VStack} from '@chakra-ui/react';
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
  const [date, setDate] = useState(defaultDate);

  return (
    <Page>
      <VStack spacing="10">
        <HStack spacing="10">
          <Select
            fontWeight="bold"
            backgroundColor="white"
            value={formatISO(date, {
              representation: 'date',
            })}
            onChange={(e) => setDate(parseISO(e.target.value))}
            minW="250px"
          >
            {DATES.map((d) => (
              <option value={formatISO(d, {representation: 'date'})}>
                {d.toLocaleDateString('de', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </option>
            ))}
          </Select>
          <Select
            fontWeight="bold"
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
        </HStack>

        <Slots day={date} partySize={partySize} />
      </VStack>
    </Page>
  );
}
