import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  Text,
  Heading,
  UseRadioProps,
} from '@chakra-ui/react';
import React from 'react';

export default function TableTypeSelector(props: {
  onChange: (prefersIsland: boolean) => void;
}) {
  const {getRootProps, getRadioProps} = useRadioGroup({
    name: 'tableType',
    onChange: (value) => props.onChange(value === 'ISLAND'),
  });

  const group = getRootProps();

  return (
    <HStack {...group} w="100%" alignItems="stretch">
      <TableTypeOption
        title="Tisch"
        description={
          <span>
            Ein Tisch dazu Bänke/
            <wbr />
            Stühle. Ihr kennt das.
          </span>
        }
        disabled={false}
        {...getRadioProps({value: 'TABLE'})}
      />
      <TableTypeOption
        title="Sitzgruppe"
        description="Gemütliche Sitz&shy;gruppe mit Sofas direkt an der Bühne"
        disabled={false}
        {...getRadioProps({value: 'ISLAND'})}
      />
    </HStack>
  );
}

function TableTypeOption({
  title,
  description,
  ...props
}: {
  title: string;
  description: React.ReactNode;
} & UseRadioProps) {
  const {getInputProps, getCheckboxProps} = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" flexGrow={1} flexBasis={0}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="md"
        color="GrayText"
        _checked={{
          borderColor: 'blue.500',
          color: 'HighlightText',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        p="3"
      >
        <Heading size="sm">{title}</Heading>
        <Text size="sm">{description}</Text>
      </Box>
    </Box>
  );
}
