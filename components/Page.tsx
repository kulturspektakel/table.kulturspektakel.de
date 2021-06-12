import React from 'react';
import {
  Box,
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  Spacer,
  Spinner,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

export default function Page({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Container maxW="container.md" pt="10" pb="20">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <HStack mb="5">
        <Heading size="lg">Tischreservierung</Heading>
        <Spacer />
        <Link href="/">
          <Box w={[20, 32, 40]} cursor="pointer">
            <img src="/logo.svg" width="100%" />
          </Box>
        </Link>
      </HStack>
      <Divider mb="5" />
      {loading ? (
        <Center h="200px">
          <Spinner />
        </Center>
      ) : (
        children
      )}
    </Container>
  );
}
