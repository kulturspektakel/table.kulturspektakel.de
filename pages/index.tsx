import React, {useState} from 'react';
import Slots from '../components/Slots';

export default function Home() {
  const [partySize, setPartySize] = useState(1);
  const [date, setDate] = useState('2020-01-01');
  return (
    <div>
      <input
        type="number"
        value={partySize}
        onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Slots day={date} partySize={partySize} />
    </div>
  );
}
