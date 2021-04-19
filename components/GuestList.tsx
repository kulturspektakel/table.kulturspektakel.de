import {gql} from '@apollo/client';
import {CloseIcon} from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import React, {useCallback, useEffect, useState} from 'react';
import {
  useCancelReservationMutation,
  useUpdateReservationMutation,
} from '../types/graphql';
import useErrorDialog from './useErrorDialog';

gql`
  mutation UpdateReservation($token: String!, $otherPersons: [String!]!) {
    updateReservation(token: $token, otherPersons: $otherPersons) {
      id
      otherPersons
    }
  }
`;

export default function useGuestListMutation({
  token,
  maxCapacity,
  initialOtherPersons,
}: {
  token: string;
  maxCapacity: number;
  initialOtherPersons: string[];
}) {
  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => setOtherPersons(initialOtherPersons), [initialOtherPersons]);
  const [otherPersons, setOtherPersons] = useState(initialOtherPersons);
  const [save, {loading, error}] = useUpdateReservationMutation();
  const callback = useCallback(
    (i, value) => {
      const newPersons = [...otherPersons];
      if (value == null) {
        newPersons.splice(i, 1);
      } else {
        newPersons[i] = value;
      }
      setOtherPersons(newPersons);
      setIsDirty(true);
    },
    [otherPersons, setOtherPersons],
  );
  const errorDialog = useErrorDialog(error);

  const rows = Math.min((maxCapacity ?? 1) - 1, otherPersons.length + 1);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) {
          save({
            variables: {
              otherPersons,
              token: token!,
            },
          })
            .then(() => {
              setIsDirty(false);
            })
            .catch(() => {
              setOtherPersons(initialOtherPersons ?? []);
            });
        }
      }}
    >
      {errorDialog}
      <VStack>
        {Array.from(Array(rows)).map((_, i) => (
          <InputGroup>
            <Input
              placeholder={`Gast ${i + 1}`}
              value={otherPersons[i] ?? ''}
              key={i}
              onChange={(e) => callback(i, e.target.value)}
            />
            <InputRightElement>
              <IconButton
                size="sm"
                aria-label="Löschen"
                icon={<CloseIcon />}
                onClick={() => callback(i, null)}
              />
            </InputRightElement>
          </InputGroup>
        ))}
      </VStack>
      {isDirty && (
        <Button
          size="sm"
          colorScheme="blue"
          mt="2"
          isDisabled={loading}
          type="submit"
        >
          Speichern
        </Button>
      )}
    </form>
  );
}
