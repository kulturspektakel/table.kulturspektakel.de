import {gql} from '@apollo/client';
import {Button} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {useCancelReservationMutation} from '../types/graphql';
import useDialog from './useDialog';
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
  const [isOpen, setIsOpen] = useState(false);
  const confirmDialog = useDialog({
    title: 'Reservierung absagen',
    body: 'Möchtest du die Reservierung wirklich absagen?',
    closeButton: 'Abbrechen',
    action: {
      callback: () => {
        save({
          variables: {
            token: props.token,
          },
        }).then(() => {
          router.push('/');
        });
      },
      label: 'Absagen',
      colorScheme: 'red',
      disabled: loading,
    },
    isOpen,
    setIsOpen,
  });

  const errorDialog = useErrorDialog(error);
  return (
    <>
      {errorDialog}
      {confirmDialog}
      <Button
        colorScheme="red"
        size="sm"
        isDisabled={loading}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Absagen
      </Button>
    </>
  );
}
