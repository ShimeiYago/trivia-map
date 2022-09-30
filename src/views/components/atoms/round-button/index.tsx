import { Typography } from '@mui/material';
import React from 'react';
import styles from './index.module.css';

export const RoundButton: React.FC<Props> = (props) => {
  const classNames = [styles['round-button']];
  if (props.selected) {
    classNames.push(styles['selected']);
  }

  return (
    <button className={`${classNames.join(' ')}`} onClick={props.onClick}>
      <Typography variant="button" component="div" color={props.selected ? 'white' : 'black'}>
        {props.children}
      </Typography>
    </button>
  );
};

export type Props = {
  children: React.ReactNode;
  selected?: boolean;

  onClick?: () => void;
};
