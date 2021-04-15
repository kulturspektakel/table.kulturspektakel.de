import React, {useEffect} from 'react';

import {ApolloError} from '@apollo/client';
import {
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';

export default function useErrorDialog(error: ApolloError | undefined) {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  useEffect(() => {
    if (error) {
      setIsOpen(true);
    }
  }, [error]);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={() => {}}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Fehler
          </AlertDialogHeader>
          <AlertDialogBody>{error?.message}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} colorScheme="blue" onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
