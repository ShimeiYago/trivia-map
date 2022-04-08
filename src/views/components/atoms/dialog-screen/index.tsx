import React from 'react';
import { Box } from '@mui/material';
import { style } from './styles';

export class DialogScreen extends React.Component<Props> {
  render() {
    const { children, theme, position } = this.props;

    return (
      // TODO: Feed in & out
      <Box sx={style(theme, position)}>{children}</Box>
    );
  }
}

export type Props = {
  children?: React.ReactNode;
  theme: 'black' | 'white';
  position: 'top' | 'bottom' | number; // 'top', 'bottom', or ratio from top
};
