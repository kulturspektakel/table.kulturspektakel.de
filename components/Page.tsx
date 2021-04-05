import React from 'react';
import {Container, Divider, Heading, HStack, Spacer} from '@chakra-ui/react';
import Head from 'next/head';

export default function Slot({children}: {children: any}) {
  return (
    <Container maxW="container.lg" pt="10">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <HStack mb="5">
        <Heading>Tischreservierung</Heading>
        <Spacer />
        <img src="/logo.svg" width="140" />
      </HStack>
      <Divider mb="5" />
      {children}
    </Container>
  );
}
