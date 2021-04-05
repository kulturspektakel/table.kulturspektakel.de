import {useSlotsQuery} from '../types/graphql';
import React from 'react';
import {gql} from '@apollo/client';
import Slot from './Slot';
import {Spinner, Table, Thead, Th, Tr, Tbody, Td} from '@chakra-ui/react';
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
      }
    }
  }
`;

const STEP_MINUTES = 15;

export default function Slots(props: {day: Date; partySize: number}) {
  const {data, loading} = useSlotsQuery({
    variables: {
      partySize: props.partySize,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  const slots =
    data?.areas
      ?.flatMap((area) => area!.reservationSlot)
      .filter((slot) => isSameDay(slot.startTime, props.day)) ?? [];

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

    for (let area of data?.areas ?? []) {
      const slot = area?.reservationSlot?.find((slot) =>
        isEqual(slot.startTime, currentTime),
      );

      if (slot) {
        cells.push(
          <Td
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
        const startTime = area?.reservationSlot[0]?.startTime;
        cells.push(
          <Td
            rowSpan={
              startTime
                ? differenceInMinutes(startTime, currentTime) / STEP_MINUTES
                : numberOfRows
            }
          />,
        );
        continue;
      }

      const previousSlotIndex =
        area?.reservationSlot?.findIndex(({endTime}) =>
          isEqual(endTime, currentTime),
        ) ?? -1;

      if (previousSlotIndex > -1) {
        // begin of empty slot, in the middle or end

        const nextStartTime =
          area?.reservationSlot[previousSlotIndex + 1]?.startTime;

        const rowSpan = nextStartTime
          ? differenceInMinutes(
              nextStartTime,
              area!.reservationSlot[previousSlotIndex].endTime,
            ) / STEP_MINUTES
          : numberOfRows - i;

        if (rowSpan > 0) {
          cells.push(<Td rowSpan={rowSpan} />);
        }
      }
    }
    rows.push(<Tr>{cells}</Tr>);
  }

  return (
    <Table variant="unstyled">
      <Thead>
        <Tr>
          {data?.areas?.map((area) => (
            <Th key={area?.id}>{area?.displayName}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
}
