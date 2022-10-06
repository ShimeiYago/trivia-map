import React from 'react';
import { Typography } from '@mui/material';
import { helperTextStyle } from './styles';

export function HelperText(props: Props): JSX.Element {
  return <Typography sx={helperTextStyle(!!props.error)}>{props.children}</Typography>;
}

export type Props = {
  children: React.ReactNode;
  error?: boolean;
};
