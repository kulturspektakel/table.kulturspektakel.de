import {gql} from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  {[SubKey in K]?: Maybe<T[SubKey]>};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  {[SubKey in K]: Maybe<T[SubKey]>};
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: Date;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: Date;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Area = Node & {
  __typename?: 'Area';
  /** Unique identifier for the resource */
  id: Scalars['ID'];
  displayName: Scalars['String'];
  reservationSlot: Array<ReservationSlot>;
  table: Array<Table>;
};

export type AreaReservationSlotArgs = {
  orderBy?: Maybe<Array<AreaReservationSlotOrderByInput>>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<ReservationSlotWhereUniqueInput>;
  after?: Maybe<ReservationSlotWhereUniqueInput>;
};

export type AreaTableArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<TableWhereUniqueInput>;
  after?: Maybe<TableWhereUniqueInput>;
};

export type AreaReservationSlotOrderByInput = {
  startTime?: Maybe<SortOrder>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelReservation?: Maybe<Scalars['Boolean']>;
  confirmReservation?: Maybe<Reservation>;
  requestReservation?: Maybe<Reservation>;
  updateReservation?: Maybe<Reservation>;
};

export type MutationCancelReservationArgs = {
  token: Scalars['String'];
};

export type MutationConfirmReservationArgs = {
  token: Scalars['String'];
};

export type MutationRequestReservationArgs = {
  primaryEmail: Scalars['String'];
  primaryPerson: Scalars['String'];
  otherEmails: Array<Scalars['String']>;
  otherPersons: Array<Scalars['String']>;
  slotIds: Array<Scalars['ID']>;
};

export type MutationUpdateReservationArgs = {
  token: Scalars['String'];
  primaryEmail: Scalars['String'];
  primaryPerson: Scalars['String'];
  otherEmails: Array<Scalars['String']>;
  otherPersons: Array<Scalars['String']>;
};

export type Node = {
  /** Unique identifier for the resource */
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  areas?: Maybe<Array<Maybe<Area>>>;
  reservationsForToken?: Maybe<Array<Maybe<Reservation>>>;
  viewer?: Maybe<Viewer>;
  node?: Maybe<Node>;
};

export type QueryReservationsForTokenArgs = {
  token: Scalars['String'];
};

export type QueryNodeArgs = {
  id: Scalars['ID'];
};

export type Reservation = {
  __typename?: 'Reservation';
  id: Scalars['Int'];
  status: ReservationStatus;
  reservationSlots: Array<ReservationSlot>;
};

export type ReservationReservationSlotsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<ReservationSlotWhereUniqueInput>;
  after?: Maybe<ReservationSlotWhereUniqueInput>;
};

export type ReservationSlot = Node & {
  __typename?: 'ReservationSlot';
  /** Unique identifier for the resource */
  id: Scalars['ID'];
  startTime: Scalars['DateTime'];
  endTime: Scalars['DateTime'];
  area: Area;
  slotAvailability?: Maybe<SlotAvailability>;
};

export type ReservationSlotSlotAvailabilityArgs = {
  partySize: Scalars['Int'];
};

export type ReservationSlotAreaIdStartTimeCompoundUniqueInput = {
  areaId: Scalars['String'];
  startTime: Scalars['DateTime'];
};

export type ReservationSlotWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
  areaId_startTime?: Maybe<ReservationSlotAreaIdStartTimeCompoundUniqueInput>;
};

export enum ReservationStatus {
  Pending = 'Pending',
  Reserved = 'Reserved',
  CheckedIn = 'CheckedIn',
  Cleared = 'Cleared',
}

export type SlotAvailability = {
  __typename?: 'SlotAvailability';
  available: Scalars['Boolean'];
  availabilityForSmallerPartySize?: Maybe<Scalars['Int']>;
  availabilityForLargerPartySize?: Maybe<Scalars['Int']>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export type Table = {
  __typename?: 'Table';
  id: Scalars['String'];
  displayName: Scalars['String'];
  maxCapacity: Scalars['Int'];
  area: Area;
};

export type TableAreaIdDisplayNameCompoundUniqueInput = {
  areaId: Scalars['String'];
  displayName: Scalars['String'];
};

export type TableWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
  areaId_displayName?: Maybe<TableAreaIdDisplayNameCompoundUniqueInput>;
};

export type Viewer = {
  __typename?: 'Viewer';
  displayName: Scalars['String'];
  email: Scalars['String'];
  profilePicture?: Maybe<Scalars['String']>;
};

export type SlotsQueryVariables = Exact<{
  partySize: Scalars['Int'];
}>;

export type SlotsQuery = {__typename?: 'Query'} & {
  areas?: Maybe<
    Array<
      Maybe<
        {__typename?: 'Area'} & Pick<Area, 'id' | 'displayName'> & {
            reservationSlot: Array<
              {__typename?: 'ReservationSlot'} & Pick<
                ReservationSlot,
                'id' | 'startTime' | 'endTime'
              > & {
                  slotAvailability?: Maybe<
                    {__typename?: 'SlotAvailability'} & Pick<
                      SlotAvailability,
                      | 'available'
                      | 'availabilityForSmallerPartySize'
                      | 'availabilityForLargerPartySize'
                    >
                  >;
                }
            >;
          }
      >
    >
  >;
};

export type ReservationQueryVariables = Exact<{
  token: Scalars['String'];
}>;

export type ReservationQuery = {__typename?: 'Query'} & {
  reservationsForToken?: Maybe<
    Array<
      Maybe<
        {__typename?: 'Reservation'} & Pick<Reservation, 'id' | 'status'> & {
            reservationSlots: Array<
              {__typename?: 'ReservationSlot'} & Pick<
                ReservationSlot,
                'id' | 'startTime' | 'endTime'
              > & {area: {__typename?: 'Area'} & Pick<Area, 'displayName'>}
            >;
          }
      >
    >
  >;
};

export type SlotQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type SlotQuery = {__typename?: 'Query'} & {
  node?: Maybe<
    | {__typename?: 'Area'}
    | ({__typename?: 'ReservationSlot'} & Pick<
        ReservationSlot,
        'startTime' | 'endTime'
      > & {area: {__typename?: 'Area'} & Pick<Area, 'displayName'>})
  >;
};

export type RequestReservationMutationVariables = Exact<{
  primaryPerson: Scalars['String'];
  primaryEmail: Scalars['String'];
  otherPersons: Array<Scalars['String']> | Scalars['String'];
  slotIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type RequestReservationMutation = {__typename?: 'Mutation'} & {
  requestReservation?: Maybe<
    {__typename?: 'Reservation'} & Pick<Reservation, 'id' | 'status'>
  >;
};

export const SlotsDocument = gql`
  query Slots($partySize: Int!) {
    areas {
      id
      displayName
      reservationSlot(orderBy: {startTime: asc}) {
        id
        startTime
        endTime
        slotAvailability(partySize: $partySize) {
          available
          availabilityForSmallerPartySize
          availabilityForLargerPartySize
        }
      }
    }
  }
`;

/**
 * __useSlotsQuery__
 *
 * To run a query within a React component, call `useSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSlotsQuery({
 *   variables: {
 *      partySize: // value for 'partySize'
 *   },
 * });
 */
export function useSlotsQuery(
  baseOptions: Apollo.QueryHookOptions<SlotsQuery, SlotsQueryVariables>,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useQuery<SlotsQuery, SlotsQueryVariables>(
    SlotsDocument,
    options,
  );
}
export function useSlotsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SlotsQuery, SlotsQueryVariables>,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useLazyQuery<SlotsQuery, SlotsQueryVariables>(
    SlotsDocument,
    options,
  );
}
export type SlotsQueryHookResult = ReturnType<typeof useSlotsQuery>;
export type SlotsLazyQueryHookResult = ReturnType<typeof useSlotsLazyQuery>;
export type SlotsQueryResult = Apollo.QueryResult<
  SlotsQuery,
  SlotsQueryVariables
>;
export const ReservationDocument = gql`
  query Reservation($token: String!) {
    reservationsForToken(token: $token) {
      id
      status
      reservationSlots {
        id
        startTime
        endTime
        area {
          displayName
        }
      }
    }
  }
`;

/**
 * __useReservationQuery__
 *
 * To run a query within a React component, call `useReservationQuery` and pass it any options that fit your needs.
 * When your component renders, `useReservationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReservationQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useReservationQuery(
  baseOptions: Apollo.QueryHookOptions<
    ReservationQuery,
    ReservationQueryVariables
  >,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useQuery<ReservationQuery, ReservationQueryVariables>(
    ReservationDocument,
    options,
  );
}
export function useReservationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ReservationQuery,
    ReservationQueryVariables
  >,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useLazyQuery<ReservationQuery, ReservationQueryVariables>(
    ReservationDocument,
    options,
  );
}
export type ReservationQueryHookResult = ReturnType<typeof useReservationQuery>;
export type ReservationLazyQueryHookResult = ReturnType<
  typeof useReservationLazyQuery
>;
export type ReservationQueryResult = Apollo.QueryResult<
  ReservationQuery,
  ReservationQueryVariables
>;
export const SlotDocument = gql`
  query Slot($id: ID!) {
    node(id: $id) {
      ... on ReservationSlot {
        startTime
        endTime
        area {
          displayName
        }
      }
    }
  }
`;

/**
 * __useSlotQuery__
 *
 * To run a query within a React component, call `useSlotQuery` and pass it any options that fit your needs.
 * When your component renders, `useSlotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSlotQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSlotQuery(
  baseOptions: Apollo.QueryHookOptions<SlotQuery, SlotQueryVariables>,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useQuery<SlotQuery, SlotQueryVariables>(SlotDocument, options);
}
export function useSlotLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SlotQuery, SlotQueryVariables>,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useLazyQuery<SlotQuery, SlotQueryVariables>(
    SlotDocument,
    options,
  );
}
export type SlotQueryHookResult = ReturnType<typeof useSlotQuery>;
export type SlotLazyQueryHookResult = ReturnType<typeof useSlotLazyQuery>;
export type SlotQueryResult = Apollo.QueryResult<SlotQuery, SlotQueryVariables>;
export const RequestReservationDocument = gql`
  mutation RequestReservation(
    $primaryPerson: String!
    $primaryEmail: String!
    $otherPersons: [String!]!
    $slotIds: [ID!]!
  ) {
    requestReservation(
      primaryPerson: $primaryPerson
      primaryEmail: $primaryEmail
      otherPersons: $otherPersons
      otherEmails: []
      slotIds: $slotIds
    ) {
      id
      status
    }
  }
`;
export type RequestReservationMutationFn = Apollo.MutationFunction<
  RequestReservationMutation,
  RequestReservationMutationVariables
>;

/**
 * __useRequestReservationMutation__
 *
 * To run a mutation, you first call `useRequestReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestReservationMutation, { data, loading, error }] = useRequestReservationMutation({
 *   variables: {
 *      primaryPerson: // value for 'primaryPerson'
 *      primaryEmail: // value for 'primaryEmail'
 *      otherPersons: // value for 'otherPersons'
 *      slotIds: // value for 'slotIds'
 *   },
 * });
 */
export function useRequestReservationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RequestReservationMutation,
    RequestReservationMutationVariables
  >,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useMutation<
    RequestReservationMutation,
    RequestReservationMutationVariables
  >(RequestReservationDocument, options);
}
export type RequestReservationMutationHookResult = ReturnType<
  typeof useRequestReservationMutation
>;
export type RequestReservationMutationResult = Apollo.MutationResult<RequestReservationMutation>;
export type RequestReservationMutationOptions = Apollo.BaseMutationOptions<
  RequestReservationMutation,
  RequestReservationMutationVariables
>;
