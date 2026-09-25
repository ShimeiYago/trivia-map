import { Stack, Typography } from '@mui/material';
import React from 'react';
import styles from './index.module.css';

export function TextList(props: Props): JSX.Element {
  return (
    <Stack spacing={1} component="ul" className={styles['ul']}>
      {props.list.map((text, index) => (
        <Typography component="li" key={`text-list-${index}`}>
          {text}
        </Typography>
      ))}
    </Stack>
  );
}

export type Props = {
  list: string[];
};
