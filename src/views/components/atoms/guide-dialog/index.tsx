import React from 'react';
import { Box, Typography } from '@mui/material';
import { style } from './styles';

export class GuideDialog extends React.Component<Props> {
  render() {
    const { children } = this.props;

    return (
      <Box sx={style}>
        <Typography color="white" align="center" variant="inherit">
          {children}
        </Typography>
      </Box>
    );
  }
}

export type Props = {
  children?: React.ReactNode;
};
