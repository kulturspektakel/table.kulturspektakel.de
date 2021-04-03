import styles from './Slots.module.css';
import React from 'react';
import {gql} from '@apollo/client';

// gql`
//   query Slots {

//   }
// `

export default function Page({area}: {area: string}) {
  return <div>{area}</div>;
}
