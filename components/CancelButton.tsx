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

export default function CancelButton(props: {
  token: string;
}): React.ReactElement {
  const [save, {loading, error}] = useCancelReservationMutation({
    errorPolicy: 'ignore',
  });
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCancled, setIsCancled] = useState(false);
  const confirmDialog = useDialog({
    title: isCancled ? 'Reservierung abgesagt' : 'Reservierung absagen',
    body: isCancled
      ? 'Deine Reservierung wurde abgesagt. Wir hoffen, dass du trotzdem zum Kult kommst.'
      : 'Möchtest du die Reservierung wirklich absagen?',
    closeButton: isCancled ? undefined : 'Abbrechen',
    action: {
      callback: () => {
        if (isCancled) {
          router.push('/');
        } else {
          save({
            variables: {
              token: props.token,
            },
          }).then(() => setIsCancled(true));
        }
      },
      label: isCancled ? 'OK' : 'Absagen',
      colorScheme: isCancled ? 'blue' : 'red',
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
