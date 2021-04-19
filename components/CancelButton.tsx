import {gql} from '@apollo/client';
import {Button} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {useCancelReservationMutation} from '../types/graphql';
import useErrorDialog from './useErrorDialog';

gql`
  mutation CancelReservation($token: String!) {
    cancelReservation(token: $token)
  }
`;

export default function CancelButton(props: {token: string}) {
  const [save, {loading, error}] = useCancelReservationMutation({
    errorPolicy: 'ignore',
  });
  const router = useRouter();

  const errorDialog = useErrorDialog(error);
  return (
    <>
      {errorDialog}
      <Button
        colorScheme="red"
        size="sm"
        isDisabled={loading}
        onClick={() =>
          save({
            variables: {
              token: props.token,
            },
          }).then(() => {
            router.push('/');
          })
        }
      >
        Absagen
      </Button>
    </>
  );
}
