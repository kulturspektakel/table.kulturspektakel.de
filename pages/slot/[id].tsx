import React from 'react';
import {useRouter} from 'next/dist/client/router';
import {Button, FormControl, FormLabel, Input, Stack} from '@chakra-ui/react';
import {gql} from '@apollo/client';
import {useRequestReservationMutation} from '../../types/graphql';

gql`
  mutation RequestReservation(
    $primaryPerson: String!
    $primaryEmail: String!
    $otherPersons: [String!]!
    $startTime: DateTime!
    $endTime: DateTime!
    $areaId: ID!
  ) {
    requestReservation(
      primaryPerson: $primaryPerson
      primaryEmail: $primaryEmail
      otherPersons: $otherPersons
      startTime: $startTime
      endTime: $endTime
      areaId: $areaId
    )
  }
`;

export default function ReserveSlot() {
  const {query} = useRouter();

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
