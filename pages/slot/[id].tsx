import React from 'react';
import {useRouter} from 'next/dist/client/router';
import {Button, FormControl, FormLabel, Input, Stack} from '@chakra-ui/react';
import {gql} from '@apollo/client';
import {useRequestReservationMutation, useSlotQuery} from '../../types/graphql';

gql`
  query Slot($id: ID!) {
    node(id: $id) {
      ... on ReservationSlot {
        startTime
        endTime
        area {
          displayName
        }
      }
    }
  }

  mutation RequestReservation(
    $primaryPerson: String!
    $primaryEmail: String!
    $otherPersons: [String!]!
    $slotIds: [ID!]!
  ) {
    requestReservation(
      primaryPerson: $primaryPerson
      primaryEmail: $primaryEmail
      otherPersons: $otherPersons
      otherEmails: []
      slotIds: $slotIds
    ) {
      id
      status
    }
  }
`;

export default function ReserveSlot() {
  const {query} = useRouter();
  const {data, loading} = useSlotQuery({
    variables: {
      id: `ReservationSlot:${query.id}`,
    },
  });

  const [
    requestReservation,
    {loading: mutationInFlight},
  ] = useRequestReservationMutation();

  const partySize = 3;

  return (
    <div>
      <Stack spacing={3}>
        <Input variant="filled" placeholder="Name" type="text" />
        <Input variant="filled" placeholder="E-Mail" type="email" />

        <FormControl id="first-name">
          <FormLabel>Name der Gäste</FormLabel>
          <Stack spacing={3}>
            {Array.from(Array(partySize - 1)).map((_, i) => (
              <Input
                variant="filled"
                placeholder={`Gast ${i + 1}`}
                type="text"
                key={i}
              />
            ))}
          </Stack>
        </FormControl>

        <Button disabled={mutationInFlight} colorScheme="blue">
          Reservieren
        </Button>
      </Stack>
    </div>
  );
}
