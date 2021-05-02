import {SlotsQuery, useSlotsQuery} from '../types/graphql';
import React from 'react';
import {gql} from '@apollo/client';
import {Spinner, Center, Box, VStack, Heading, Flex} from '@chakra-ui/react';
import {
  add,
  isEqual,
  isBefore,
  isAfter,
  max,
  isWithinInterval,
  differenceInMinutes,
  isFuture,
} from 'date-fns';
import {SlotContent, SlotLink, SlotPopover} from './Slot';
import Sticky from './Sticky';

gql`
  query Slots($partySize: Int!, $day: Date!) {
    areas {
      id
      displayName
      openingHour(day: $day) {
        startTime
        endTime
      }
      availability(day: $day, partySize: $partySize) {
        startTime
        endTime
      }
      bandsPlaying(day: $day) {
        ...BandPopover
        startTime
        endTime
      }
    }
  }
`;

export const STEP_MINUTES = 30;

export default function Slots(props: {day: Date; partySize: number}) {
  const {data} = useSlotsQuery({
    variables: {
      partySize: props.partySize,
      day: props.day,
    },
  });

  if (!data) {
    return (
      <Center h="200px">
        <Spinner />
      </Center>
    );
  }

  const from = new Date(
    Math.min(
      ...data.areas.flatMap(({openingHour}) =>
        openingHour.map(({startTime}) => startTime.getTime()),
      ),
    ),
  );

  const until = new Date(
    Math.max(
      ...data.areas.flatMap(({openingHour}) =>
        openingHour.map(({endTime}) => endTime.getTime()),
      ),
    ),
  );

  const w = `${100 / data.areas.length}%`;

  const HYPHENS: Record<string, JSX.Element> = {
    wb: <>Wald&shy;bühne</>,
    wbg: <>Weiß&shy;bier&shy;garten</>,
  };

  return (
    <Box w="100%">
      <Sticky>
        {(ref, style) => (
          <Box h="12" w="100%" ref={ref}>
            <Flex h="12" style={style} bgColor="gray.50">
              {data.areas.map((area) => (
                <Center h="100%" minW={w} maxW={w} key={area.id}>
                  <Heading size="sm" mb={0} textAlign="center" noOfLines={2}>
                    {HYPHENS[area.id] ?? area.displayName}
                  </Heading>
                </Center>
              ))}
            </Flex>
          </Box>
        )}
      </Sticky>
      <Flex w="100%">
        {data.areas.map((area) => (
          <Box minW={w} maxW={w} key={area.id}>
            <AreaSlots
              area={area}
              from={from}
              until={until}
              partySize={props.partySize}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}

function AreaSlots(props: {
  area: SlotsQuery['areas'][number];
  from: Date;
  until: Date;
  partySize: number;
}) {
  const steps = differenceInMinutes(props.until, props.from) / STEP_MINUTES;
  return (
    <VStack p="1">
      {Array.from(Array(steps)).map((_, i) => {
        const time = add(props.from, {minutes: STEP_MINUTES * i});
        const open = isOpen(props.area.openingHour, time);
        // allows selecting, if less than
        const mx = maxAvailability(props.area.availability, time);
        const available =
          (open &&
            mx &&
            isFuture(time) &&
            differenceInMinutes(mx, time) >= 90) ??
          false;

        const band = props.area.bandsPlaying.find((i) => isWithin(i, time));
        return (
          <SlotPopover
            band={available ? band : undefined}
            key={time.toString()}
          >
            <SlotLink
              startTime={time}
              area={props.area}
              endTime={mx}
              partySize={props.partySize}
            >
              <SlotContent time={time} available={available} open={open} />
            </SlotLink>
          </SlotPopover>
        );
      })}
    </VStack>
  );
}

type Interval = {startTime: Date; endTime: Date};

const maxAvailability = (intervals: Interval[], time: Date) =>
  intervals.reduce<Date | null>((acc, {startTime: start, endTime: end}) => {
    if (
      isWithinInterval(time, {start, end}) &&
      isWithinInterval(add(time, {minutes: 90}), {start, end})
    ) {
      acc = max([acc ?? new Date(0), end]);
    }
    return acc;
  }, null);

const isOpen = (intervals: Interval[], time: Date) =>
  intervals.some((interval) => isWithin(interval, time));

const isWithin = ({startTime, endTime}: Interval, time: Date) =>
  (isEqual(time, startTime) || isAfter(time, startTime)) &&
  isBefore(time, endTime);
