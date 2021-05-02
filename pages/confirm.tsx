import {CheckCircleIcon} from '@chakra-ui/icons';
import {Box, Center, Heading, Text, VStack} from '@chakra-ui/react';
import React from 'react';
import Page from '../components/Page';

export default function Confirm() {
  return (
    <Page>
      <Box boxShadow="sm" bg="white" borderRadius="md" p="5">
        <Center>
          <VStack>
            <CheckCircleIcon color="green.500" boxSize={8} />
            <Heading size="md">Reservierung bestätigen</Heading>
            <Text>
              Wir haben dir eine E-Mail geschickt um die Reserverung zu
              bestätigen. Öffne dazu den Link in der E-Mail, die du gerade
              bekommen hast innerhalb der nächsten 30 Minuten. Ansonsten wird
              deine Reservierung wieder freigegeben.
            </Text>
          </VStack>
        </Center>
      </Box>
    </Page>
  );
}
