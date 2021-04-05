import {useSlotsQuery} from '../types/graphql';
import React from 'react';
import {gql} from '@apollo/client';
import Slot from './Slot';
import {
  Spinner,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Center,
} from '@chakra-ui/react';
import {add, differenceInMinutes, isEqual, isSameDay} from 'date-fns';

gql`
  query Slots($partySize: Int!) {
    areas {
      id
      displayName
      reservationSlot(orderBy: {startTime: asc}) {
        id
        startTime
        endTime
        slotAvailability(partySize: $partySize) {
          available
          availabilityForSmallerPartySize
          availabilityForLargerPartySize
        }
        bandsPlaying {
          id
          name
          genre
          startTime
        }
      }
    }
  }
`;

const STEP_MINUTES = 15;

export default function Slots(props: {day: Date; partySize: number}) {
  const {data} = useSlotsQuery({
    variables: {
      partySize: props.partySize,
    },
  });

  if (!data) {
    return (
      <Center h="200px">
        <Spinner />
      </Center>
    );
  }

  const slots = data.areas
    .flatMap((area) => area!.reservationSlot)
    .filter((slot) => isSameDay(slot.startTime, props.day));

  const earliestStartTime = slots.reduce(
    (acc, slot) => (acc < slot.startTime ? acc : slot.startTime),
    new Date(Infinity),
  );

  const latestEndTime = slots.reduce(
    (acc, slot) => (acc > slot.endTime ? acc : slot.endTime),
    new Date(0),
  );

  const rows = [];
  const numberOfRows =
    differenceInMinutes(latestEndTime, earliestStartTime) / STEP_MINUTES;
  for (let i = 0; i < numberOfRows; i++) {
    const cells = [];

    const currentTime = add(earliestStartTime, {
      minutes: i * STEP_MINUTES,
    });

    for (let area of data.areas) {
      const slot = area.reservationSlot.find((slot) =>
        isEqual(slot.startTime, currentTime),
      );

      if (slot) {
        cells.push(
          <Td
            key={area.id}
            rowSpan={
              differenceInMinutes(slot.endTime, slot.startTime) / STEP_MINUTES
            }
          >
            <Slot data={slot} key={slot.id} partySize={props.partySize} />
          </Td>,
        );
        continue;
      }

      if (i === 0) {
        // start with empty slot
        const startTime: Date | null = area.reservationSlot[0]?.startTime;
        cells.push(
          <Td
            key={area.id}
            rowSpan={
              startTime
                ? differenceInMinutes(startTime, currentTime) / STEP_MINUTES
                : numberOfRows
            }
          />,
        );
        continue;
      }

      const previousSlotIndex = area.reservationSlot.findIndex(({endTime}) =>
        isEqual(endTime, currentTime),
      );

      if (previousSlotIndex > -1) {
        // begin of empty slot, in the middle or end

        const nextStartTime: Date | null =
          area.reservationSlot[previousSlotIndex + 1]?.startTime;

        const rowSpan = nextStartTime
          ? differenceInMinutes(
              nextStartTime,
              area.reservationSlot[previousSlotIndex].endTime,
            ) / STEP_MINUTES
          : numberOfRows - i;

        if (rowSpan > 0) {
          cells.push(<Td key={area.id} rowSpan={rowSpan} />);
        }
      }
    }
    rows.push(
      <Tr
        key={i}
        boxShadow={
          (STEP_MINUTES * i) % 60 == 0
            ? `0 -1px 0 var(--chakra-colors-gray-200)`
            : undefined
        }
      >
        {cells}
      </Tr>,
    );
  }

  return (
    <Table variant="unstyled" height="1px" size="sm">
      <Thead>
        <Tr>
          {data.areas.map((area) => (
            <Th width={`${(1 / data.areas.length) * 100}%`} key={area.id}>
              {area.displayName}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
}
