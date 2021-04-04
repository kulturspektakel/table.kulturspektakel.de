import {HStack, Select} from '@chakra-ui/react';
import React, {useState} from 'react';
import Slots from '../components/Slots';
import {formatISO, parseISO} from 'date-fns';

export default function Home() {
  const [partySize, setPartySize] = useState(1);
  const [date, setDate] = useState(new Date('2021-07-23'));
  return (
    <div>
      <HStack>
        <input
          type="number"
          value={partySize}
          onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
        />
        <Select
          variant="filled"
          value={formatISO(date, {
            representation: 'date',
          })}
          onChange={(e) => setDate(parseISO(e.target.value))}
        >
          <option value="2021-07-23">Freitag</option>
          <option value="2021-07-24">Samstag</option>
          <option value="2021-07-25">Sonntag</option>
        </Select>
      </HStack>

      <Slots day={date} partySize={partySize} />
    </div>
  );
}
