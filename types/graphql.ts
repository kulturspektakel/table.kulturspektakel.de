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
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Area = {
  __typename?: 'Area';
  id: Scalars['String'];
  displayName: Scalars['String'];
  reservableSlots?: Maybe<Array<Maybe<SlotAvailability>>>;
};

export type AreaReservableSlotsArgs = {
  partySize: Scalars['Int'];
  date: Scalars['Date'];
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

export type Query = {
  __typename?: 'Query';
  areas?: Maybe<Array<Maybe<Area>>>;
  area?: Maybe<Area>;
  reservations?: Maybe<Array<Maybe<Reservation>>>;
  viewer?: Maybe<Viewer>;
};

export type QueryAreaArgs = {
  id: Scalars['ID'];
};

export type QueryReservationsArgs = {
  token: Scalars['String'];
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

export type ReservationSlot = {
  __typename?: 'ReservationSlot';
  id: Scalars['String'];
  startTime: Scalars['DateTime'];
  endTime: Scalars['DateTime'];
  area: Area;
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
  reservationSlot: ReservationSlot;
  consecutiveAvailableSlots?: Maybe<Array<Maybe<ReservationSlot>>>;
};

export type Table = {
  __typename?: 'Table';
  displayName: Scalars['String'];
  maxCapacity: Scalars['Int'];
  area: Area;
};

export type Viewer = {
  __typename?: 'Viewer';
  displayName: Scalars['String'];
  email: Scalars['String'];
  profilePicture?: Maybe<Scalars['String']>;
};

export type ViewerQueryVariables = Exact<{[key: string]: never}>;

export type ViewerQuery = {__typename?: 'Query'} & {
  viewer?: Maybe<
    {__typename?: 'Viewer'} & Pick<Viewer, 'profilePicture' | 'displayName'>
  >;
};

export type SlotsQueryVariables = Exact<{
  areaId: Scalars['ID'];
}>;

export type SlotsQuery = {__typename?: 'Query'} & {
  area?: Maybe<
    {__typename?: 'Area'} & {
      friday?: Maybe<
        Array<
          Maybe<
            {__typename?: 'SlotAvailability'} & {
              reservationSlot: {__typename?: 'ReservationSlot'} & Pick<
                ReservationSlot,
                'id' | 'startTime' | 'endTime'
              >;
            }
          >
        >
      >;
    }
  >;
};

export type TablesQueryVariables = Exact<{[key: string]: never}>;

export type TablesQuery = {__typename?: 'Query'} & {
  areas?: Maybe<
    Array<Maybe<{__typename?: 'Area'} & Pick<Area, 'id' | 'displayName'>>>
  >;
};

export const ViewerDocument = gql`
  query Viewer {
    viewer {
      profilePicture
      displayName
    }
  }
`;

/**
 * __useViewerQuery__
 *
 * To run a query within a React component, call `useViewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewerQuery({
 *   variables: {
 *   },
 * });
 */
export function useViewerQuery(
  baseOptions?: Apollo.QueryHookOptions<ViewerQuery, ViewerQueryVariables>,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useQuery<ViewerQuery, ViewerQueryVariables>(
    ViewerDocument,
    options,
  );
}
export function useViewerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ViewerQuery, ViewerQueryVariables>,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useLazyQuery<ViewerQuery, ViewerQueryVariables>(
    ViewerDocument,
    options,
  );
}
export type ViewerQueryHookResult = ReturnType<typeof useViewerQuery>;
export type ViewerLazyQueryHookResult = ReturnType<typeof useViewerLazyQuery>;
export type ViewerQueryResult = Apollo.QueryResult<
  ViewerQuery,
  ViewerQueryVariables
>;
export const SlotsDocument = gql`
  query Slots($areaId: ID!) {
    area(id: $areaId) {
      friday: reservableSlots(partySize: 0, date: "2020-01-01") {
        reservationSlot {
          id
          startTime
          endTime
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
 *      areaId: // value for 'areaId'
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
export const TablesDocument = gql`
  query Tables {
    areas {
      id
      displayName
    }
  }
`;

/**
 * __useTablesQuery__
 *
 * To run a query within a React component, call `useTablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTablesQuery(
  baseOptions?: Apollo.QueryHookOptions<TablesQuery, TablesQueryVariables>,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useQuery<TablesQuery, TablesQueryVariables>(
    TablesDocument,
    options,
  );
}
export function useTablesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TablesQuery, TablesQueryVariables>,
) {
  const options = {...defaultOptions, ...baseOptions};
  return Apollo.useLazyQuery<TablesQuery, TablesQueryVariables>(
    TablesDocument,
    options,
  );
}
export type TablesQueryHookResult = ReturnType<typeof useTablesQuery>;
export type TablesLazyQueryHookResult = ReturnType<typeof useTablesLazyQuery>;
export type TablesQueryResult = Apollo.QueryResult<
  TablesQuery,
  TablesQueryVariables
>;
