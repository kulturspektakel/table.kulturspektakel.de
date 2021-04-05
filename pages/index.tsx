import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
  Text,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import Slots from '../components/Slots';
import {formatISO, parseISO} from 'date-fns';

export default function Home() {
  const [partySize, setPartySize] = useState(4);
  const [date, setDate] = useState(new Date('2021-07-23'));
  return (
    <VStack padding="5" spacing="5" maxWidth="900" align="stretch">
      <Heading>Kulturspektakel Tischreservierung</Heading>
      <Text>asd</Text>
      <HStack spacing="10">
        <FormControl id="day">
          <FormLabel>Tag</FormLabel>
          <Select
            fontWeight="bold"
            backgroundColor="white"
            value={formatISO(date, {
              representation: 'date',
            })}
            onChange={(e) => setDate(parseISO(e.target.value))}
          >
            <option value="2021-07-23">Freitag, 23. Juli 2021</option>
            <option value="2021-07-24">Samstag, 24. Juli 2021</option>
            <option value="2021-07-25">Sonntag, 25. Juli 2021</option>
          </Select>
        </FormControl>
        <FormControl id="partySize">
          <FormLabel>Personenzahl</FormLabel>
          <Slider
            value={partySize}
            min={2}
            max={10}
            step={1}
            onChange={setPartySize}
          >
            <SliderTrack>
              <Box position="relative" right={10} />
              <SliderFilledTrack bg="red.500" />
            </SliderTrack>
            <SliderThumb boxSize={6} fontWeight="bold">
              {partySize}
            </SliderThumb>
          </Slider>
        </FormControl>
      </HStack>

      <Slots day={date} partySize={partySize} />
    </VStack>
  );
}
