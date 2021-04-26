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
  table: Array<Table>;
  openingHour: Array<Availability>;
  availability: Array<Availability>;
  bandsPlaying: Array<Band>;
};

export type AreaTableArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<TableWhereUniqueInput>;
  after?: Maybe<TableWhereUniqueInput>;
};

export type AreaOpeningHourArgs = {
  day?: Maybe<Scalars['Date']>;
};

export type AreaAvailabilityArgs = {
  partySize: Scalars['Int'];
  day: Scalars['Date'];
};

export type AreaBandsPlayingArgs = {
  day: Scalars['Date'];
};

export type Availability = {
  __typename?: 'Availability';
  startTime: Scalars['DateTime'];
  endTime: Scalars['DateTime'];
};

export type Band = {
  __typename?: 'Band';
  id: Scalars['Int'];
  name: Scalars['String'];
  genre?: Maybe<Scalars['String']>;
  startTime: Scalars['DateTime'];
  endTime: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelReservation?: Maybe<Scalars['Boolean']>;
  confirmReservation?: Maybe<Reservation>;
  requestReservation: Scalars['Boolean'];
  updateReservation?: Maybe<Reservation>;
  createOrder?: Maybe<Order>;
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
  otherPersons: Array<Scalars['String']>;
  startTime: Scalars['DateTime'];
  endTime: Scalars['DateTime'];
  areaId: Scalars['ID'];
};

export type MutationUpdateReservationArgs = {
  token: Scalars['String'];
  otherPersons: Array<Scalars['String']>;
};

export type MutationCreateOrderArgs = {
  tableId: Scalars['ID'];
  products: Array<OrderItemInput>;
  payment: OrderPayment;
};

export type Node = {
  /** Unique identifier for the resource */
  id: Scalars['ID'];
};

export type Order = {
  __typename?: 'Order';
  id: Scalars['Int'];
  payment: OrderPayment;
  tokens: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  table?: Maybe<Table>;
  items: Array<OrderItem>;
  total?: Maybe<Scalars['Int']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  id: Scalars['Int'];
  note?: Maybe<Scalars['String']>;
  amount: Scalars['Int'];
  name: Scalars['String'];
};

export type OrderItemInput = {
  productId: Scalars['Int'];
  amount: Scalars['Int'];
  note?: Maybe<Scalars['String']>;
};

export enum OrderPayment {
  Cash = 'CASH',
  Bon = 'BON',
  SumUp = 'SUM_UP',
  Voucher = 'VOUCHER',
  FreeCrew = 'FREE_CREW',
  FreeBand = 'FREE_BAND',
}

export type Product = {
  __typename?: 'Product';
  id: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Int'];
};

export type ProductList = {
  __typename?: 'ProductList';
  id: Scalars['Int'];
  name: Scalars['String'];
  emoji?: Maybe<Scalars['String']>;
  product: Array<Product>;
};

export type ProductListProductArgs = {
  orderBy?: Maybe<Array<ProductListProductOrderByInput>>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<ProductWhereUniqueInput>;
  after?: Maybe<ProductWhereUniqueInput>;
};

export type ProductListProductOrderByInput = {
  order?: Maybe<SortOrder>;
};

export type ProductProductListIdOrderCompoundUniqueInput = {
  productListId: Scalars['Int'];
  order: Scalars['Int'];
};

export type ProductWhereUniqueInput = {
  id?: Maybe<Scalars['Int']>;
  productListId_order?: Maybe<ProductProductListIdOrderCompoundUniqueInput>;
};

export type Query = {
  __typename?: 'Query';
  areas: Array<Area>;
  reservationForToken?: Maybe<Reservation>;
  viewer?: Maybe<Viewer>;
  node?: Maybe<Node>;
  productLists: Array<ProductList>;
  orders: Array<Order>;
};

export type QueryReservationForTokenArgs = {
  token: Scalars['String'];
};

export type QueryNodeArgs = {
  id: Scalars['ID'];
};

export type Reservation = {
  __typename?: 'Reservation';
  id: Scalars['Int'];
  status: ReservationStatus;
  token: Scalars['String'];
  table: Table;
  startTime: Scalars['DateTime'];
  endTime: Scalars['DateTime'];
  primaryPerson: Scalars['String'];
  otherPersons: Array<Scalars['String']>;
  reservationsFromSamePerson: Array<Reservation>;
};

export enum ReservationStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  CheckedIn = 'CheckedIn',
  Cleared = 'Cleared',
}

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

export type CancelReservationMutationVariables = Exact<{
  token: Scalars['String'];
}>;

export type CancelReservationMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'cancelReservation'
>;

export type UpdateReservationMutationVariables = Exact<{
  token: Scalars['String'];
  otherPersons: Array<Scalars['String']> | Scalars['String'];
}>;

export type UpdateReservationMutation = {__typename?: 'Mutation'} & {
  updateReservation?: Maybe<
    {__typename?: 'Reservation'} & Pick<Reservation, 'id' | 'otherPersons'>
  >;
};

export type ReservationFragmentFragment = {__typename?: 'Reservation'} & Pick<
  Reservation,
  'id' | 'token' | 'startTime' | 'endTime' | 'status'
> & {
    table: {__typename?: 'Table'} & Pick<Table, 'maxCapacity'> & {
        area: {__typename?: 'Area'} & Pick<Area, 'displayName'>;
      };
  };

export type BandPopoverFragment = {__typename?: 'Band'} & Pick<
  Band,
  'name' | 'genre'
>;

export type SlotsQueryVariables = Exact<{
  partySize: Scalars['Int'];
  day: Scalars['Date'];
}>;

export type SlotsQuery = {__typename?: 'Query'} & {
  areas: Array<
    {__typename?: 'Area'} & Pick<Area, 'id' | 'displayName'> & {
        openingHour: Array<
          {__typename?: 'Availability'} & Pick<
            Availability,
            'startTime' | 'endTime'
          >
        >;
        availability: Array<
          {__typename?: 'Availability'} & Pick<
            Availability,
            'startTime' | 'endTime'
          >
        >;
        bandsPlaying: Array<
          {__typename?: 'Band'} & Pick<Band, 'startTime' | 'endTime'> &
            BandPopoverFragment
        >;
      }
  >;
};

export type RequestMutationVariables = Exact<{
  areaId: Scalars['ID'];
  endTime: Scalars['DateTime'];
  startTime: Scalars['DateTime'];
  primaryPerson: Scalars['String'];
  primaryEmail: Scalars['String'];
  otherPersons: Array<Scalars['String']> | Scalars['String'];
}>;

export type RequestMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'requestReservation'
>;

export type ReservationQueryVariables = Exact<{
  token: Scalars['String'];
}>;

export type ReservationQuery = {__typename?: 'Query'} & {
  reservationForToken?: Maybe<
    {__typename?: 'Reservation'} & Pick<
      Reservation,
      | 'id'
      | 'token'
      | 'startTime'
      | 'endTime'
      | 'status'
      | 'primaryPerson'
      | 'otherPersons'
    > & {
        table: {__typename?: 'Table'} & Pick<Table, 'maxCapacity'> & {
            area: {__typename?: 'Area'} & Pick<Area, 'displayName'>;
          };
        reservationsFromSamePerson: Array<
          {__typename?: 'Reservation'} & ReservationFragmentFragment
        >;
      }
  >;
};

export type ConfimReservationMutationVariables = Exact<{
  token: Scalars['String'];
}>;

export type ConfimReservationMutation = {__typename?: 'Mutation'} & {
  confirmReservation?: Maybe<
    {__typename?: 'Reservation'} & Pick<Reservation, 'id' | 'status'> & {
        reservationsFromSamePerson: Array<
          {__typename?: 'Reservation'} & ReservationFragmentFragment
        >;
      }
  >;
};

export const ReservationFragmentFragmentDoc = gql`
  fragment ReservationFragment on Reservation {
    id
    token
    startTime
    endTime
    table {
      maxCapacity
      area {
        displayName
      }
    }
    status
  }
`;
export const BandPopoverFragmentDoc = gql`
  fragment BandPopover on Band {
    name
    genre
  }
`;
export const CancelReservationDocument = gql`
  mutation CancelReservation($token: String!) {
    cancelReservation(token: $token)
  }
`;
export type CancelReservationMutationFn = Apollo.MutationFunction<
  CancelReservationMutation,
  CancelReservationMutationVariables
>;

/**
 * __useCancelReservationMutation__
 *
 * To run a mutation, you first call `useCancelReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelReservationMutation, { data, loading, error }] = useCancelReservationMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useCancelReservationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CancelReservationMutation,
    CancelReservationMutationVariables
  >,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useMutation<
    CancelReservationMutation,
    CancelReservationMutationVariables
  >(CancelReservationDocument, options);
}
export type CancelReservationMutationHookResult = ReturnType<
  typeof useCancelReservationMutation
>;
export type CancelReservationMutationResult = Apollo.MutationResult<CancelReservationMutation>;
export type CancelReservationMutationOptions = Apollo.BaseMutationOptions<
  CancelReservationMutation,
  CancelReservationMutationVariables
>;
export const UpdateReservationDocument = gql`
  mutation UpdateReservation($token: String!, $otherPersons: [String!]!) {
    updateReservation(token: $token, otherPersons: $otherPersons) {
      id
      otherPersons
    }
  }
`;
export type UpdateReservationMutationFn = Apollo.MutationFunction<
  UpdateReservationMutation,
  UpdateReservationMutationVariables
>;

/**
 * __useUpdateReservationMutation__
 *
 * To run a mutation, you first call `useUpdateReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReservationMutation, { data, loading, error }] = useUpdateReservationMutation({
 *   variables: {
 *      token: // value for 'token'
 *      otherPersons: // value for 'otherPersons'
 *   },
 * });
 */
export function useUpdateReservationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateReservationMutation,
    UpdateReservationMutationVariables
  >,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useMutation<
    UpdateReservationMutation,
    UpdateReservationMutationVariables
  >(UpdateReservationDocument, options);
}
export type UpdateReservationMutationHookResult = ReturnType<
  typeof useUpdateReservationMutation
>;
export type UpdateReservationMutationResult = Apollo.MutationResult<UpdateReservationMutation>;
export type UpdateReservationMutationOptions = Apollo.BaseMutationOptions<
  UpdateReservationMutation,
  UpdateReservationMutationVariables
>;
export const SlotsDocument = gql`
  query Slots($partySize: Int!, $day: Date!) {
    areas {
      id
      displayName
      openingHour(day: $day) {
        startTime
        endTime
      }
      availability(day: $day, partySize: $partySize) {
        startTime
        endTime
      }
      bandsPlaying(day: $day) {
        ...BandPopover
        startTime
        endTime
      }
    }
  }
  ${BandPopoverFragmentDoc}
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
 *      day: // value for 'day'
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
export const RequestDocument = gql`
  mutation Request(
    $areaId: ID!
    $endTime: DateTime!
    $startTime: DateTime!
    $primaryPerson: String!
    $primaryEmail: String!
    $otherPersons: [String!]!
  ) {
    requestReservation(
      areaId: $areaId
      endTime: $endTime
      startTime: $startTime
      primaryPerson: $primaryPerson
      primaryEmail: $primaryEmail
      otherPersons: $otherPersons
    )
  }
`;
export type RequestMutationFn = Apollo.MutationFunction<
  RequestMutation,
  RequestMutationVariables
>;

/**
 * __useRequestMutation__
 *
 * To run a mutation, you first call `useRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestMutation, { data, loading, error }] = useRequestMutation({
 *   variables: {
 *      areaId: // value for 'areaId'
 *      endTime: // value for 'endTime'
 *      startTime: // value for 'startTime'
 *      primaryPerson: // value for 'primaryPerson'
 *      primaryEmail: // value for 'primaryEmail'
 *      otherPersons: // value for 'otherPersons'
 *   },
 * });
 */
export function useRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RequestMutation,
    RequestMutationVariables
  >,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useMutation<RequestMutation, RequestMutationVariables>(
    RequestDocument,
    options,
  );
}
export type RequestMutationHookResult = ReturnType<typeof useRequestMutation>;
export type RequestMutationResult = Apollo.MutationResult<RequestMutation>;
export type RequestMutationOptions = Apollo.BaseMutationOptions<
  RequestMutation,
  RequestMutationVariables
>;
export const ReservationDocument = gql`
  query Reservation($token: String!) {
    reservationForToken(token: $token) {
      id
      token
      startTime
      endTime
      table {
        maxCapacity
        area {
          displayName
        }
      }
      status
      primaryPerson
      otherPersons
      reservationsFromSamePerson {
        ...ReservationFragment
      }
    }
  }
  ${ReservationFragmentFragmentDoc}
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
export const ConfimReservationDocument = gql`
  mutation ConfimReservation($token: String!) {
    confirmReservation(token: $token) {
      id
      status
      reservationsFromSamePerson {
        ...ReservationFragment
      }
    }
  }
  ${ReservationFragmentFragmentDoc}
`;
export type ConfimReservationMutationFn = Apollo.MutationFunction<
  ConfimReservationMutation,
  ConfimReservationMutationVariables
>;

/**
 * __useConfimReservationMutation__
 *
 * To run a mutation, you first call `useConfimReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfimReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confimReservationMutation, { data, loading, error }] = useConfimReservationMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfimReservationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ConfimReservationMutation,
    ConfimReservationMutationVariables
  >,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useMutation<
    ConfimReservationMutation,
    ConfimReservationMutationVariables
  >(ConfimReservationDocument, options);
}
export type ConfimReservationMutationHookResult = ReturnType<
  typeof useConfimReservationMutation
>;
export type ConfimReservationMutationResult = Apollo.MutationResult<ConfimReservationMutation>;
export type ConfimReservationMutationOptions = Apollo.BaseMutationOptions<
  ConfimReservationMutation,
  ConfimReservationMutationVariables
>;
