import {
  Stack,
  Select,
  VStack,
  Center,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import Slots from '../components/Slots';
import {formatISO, isSameDay, parseISO} from 'date-fns';
import Page from '../components/Page';
import {QuestionIcon} from '@chakra-ui/icons';
import {gql} from '@apollo/client';
import {useConfigQuery} from '../types/graphql';
import Countdown from '../components/Countdown';

const DATES = [
  new Date('2021-07-23'),
  new Date('2021-07-24'),
  new Date('2021-07-25'),
];

gql`
  query Config {
    config {
      reservationStart
    }
  }
`;

export default function Home() {
  const [partySize, setPartySize] = useState<number | null>(null);
  const defaultDate = DATES.find((d) => isSameDay(d, new Date())) ?? DATES[0];
  const [startTime, setStartTime] = useState(defaultDate);
  const {data} = useConfigQuery();

  return (
    <Page>
      <VStack spacing="10">
        <VStack>
          <Text>
            Um das Kult zu besuchen braucht ihr dieses Jahr einen festen
            Sitzplatz. In Gruppen von bis zu zehn Personen könnt ihr euch in
            unseren verschiedenen Bereichen Plätze reservieren. Ein spontaner
            Besuch ist auch möglich sofern noch Plätze frei sind.
          </Text>
          <Text>
            Eure Reservierung ist nur für den ausgewählten Zeitraum und Bereich
            gültig, aber es ist möglich mehrere Reservierungen zu machen.
          </Text>
        </VStack>
        {data?.config?.reservationStart && (
          <Countdown date={data.config.reservationStart}>
            <Stack
              spacing={['3', '10']}
              direction={['column', 'row']}
              width="100%"
            >
              <Select
                fontWeight="semibold"
                backgroundColor="white"
                value={formatISO(startTime, {
                  representation: 'date',
                })}
                onChange={(e) =>
                  setStartTime(parseISO(e.target.value + 'T10:00:00'))
                }
              >
                {DATES.map((d, i) => (
                  <option
                    key={i}
                    value={formatISO(d, {representation: 'date'})}
                  >
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
                value={partySize ?? 'null'}
                color={partySize == null ? 'gray.400' : 'black'}
                onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
              >
                {partySize == null && (
                  <option disabled value="null" style={{color: '#A0AEC0'}}>
                    Personenzahl
                  </option>
                )}
                {Array.from(Array(9)).map((_, i) => (
                  <option key={i} value={i + 2} style={{color: 'black'}}>
                    {i + 2} Personen
                  </option>
                ))}
              </Select>
            </Stack>

            {partySize != null ? (
              <>
                {partySize < 4 && (
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    Falls zur gewünschten Zeit kein Tisch mehr frei ist, könnt
                    ihr probieren ob einen größerer Tisch für 4 oder mehr
                    Personen verfügbar ist.
                  </Alert>
                )}
                <Slots day={startTime} partySize={partySize} />
              </>
            ) : (
              <Center pt="6" flexDirection="column">
                <QuestionIcon color="gray.400" pb="2" boxSize="8" />
                <Text color="gray.500" fontWeight="semibold">
                  Bitte Anzahl der Personen auswählen
                </Text>
              </Center>
            )}
          </Countdown>
        )}
      </VStack>
    </Page>
  );
}
