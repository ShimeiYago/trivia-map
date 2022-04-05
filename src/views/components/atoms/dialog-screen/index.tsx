import React from 'react';
import { Box, Typography } from '@mui/material';
import { style } from './styles';

export class DialogScreen extends React.Component<Props> {
  render() {
    const { children, theme, position } = this.props;

    return (
      <Box sx={style(theme, position)}>
        <Typography color="white" align="center" variant="inherit">
          {children}
        </Typography>
      </Box>
    );
  }
}

export type Props = {
  children?: React.ReactNode;
  theme: 'black' | 'white';
  position: 'top' | 'bottom';
};
