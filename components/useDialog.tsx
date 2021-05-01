import React from 'react';

import {
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogFooter,
  ThemeTypings,
} from '@chakra-ui/react';

export default function useDialog(props: {
  title: string;
  body: React.ReactNode;
  action?: {
    label: string;
    callback: () => void;
    colorScheme?: ThemeTypings['colorSchemes'];
    disabled?: boolean;
  };
  closeButton?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}): React.ReactElement {
  const onClose = () => props.setIsOpen(false);
  const cancelRef = React.useRef(null);

  return (
    <AlertDialog
      isOpen={props.isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent ms="2" me="2">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {props.title}
          </AlertDialogHeader>
          <AlertDialogBody>{props.body}</AlertDialogBody>
          <AlertDialogFooter>
            {props.closeButton && (
              <Button
                ref={cancelRef}
                colorScheme={props.action ? undefined : 'blue'}
                onClick={onClose}
              >
                {props.closeButton}
              </Button>
            )}
            {props.action && (
              <Button
                disabled={props.action.disabled}
                ms="2"
                ref={cancelRef}
                colorScheme={props.action.colorScheme ?? 'blue'}
                onClick={props.action.callback}
              >
                {props.action.label}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
