import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  Text,
  Heading,
  UseRadioProps,
  Circle,
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
        description="Gemütliche Sitz&shy;gruppe mit Sofas direkt an der Bühne."
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
        h="100%"
        _checked={{
          borderColor: 'blue.500',
          color: 'HighlightText',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        p="3"
      >
        <Heading size="sm" pb="1">
          <Circle
            size="4"
            borderColor={props.isChecked ? 'blue.500' : 'gray.200'}
            borderWidth={props.isChecked ? '5px' : '2px'}
            display="inline-block"
            mb="-2px"
            mr="0.5"
          />
          &nbsp;
          {title}
        </Heading>
        <Text fontSize="sm" lineHeight="shorter">
          {description}
        </Text>
      </Box>
    </Box>
  );
}
