import React, {useEffect} from 'react';

import {ApolloError} from '@apollo/client';
import useDialog from './useDialog';

export default function useErrorDialog(error: ApolloError | undefined) {
  const [isOpen, setIsOpen] = React.useState(false);

  const dialog = useDialog({
    title: 'Fehler',
    body: error?.message,
    closeButton: 'Ok',
    isOpen,
    setIsOpen,
  });

  useEffect(() => {
    if (error) {
      setIsOpen(true);
    }
  }, [error]);

  return dialog;
}
