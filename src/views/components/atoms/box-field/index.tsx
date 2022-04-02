import React from 'react';
import { Box, Typography } from '@mui/material';
import { helperTextStyle, wrapper } from './styles';

export class BoxField extends React.Component<Props> {
  render() {
    const { children, error, helperText, onClick } = this.props;

    return (
      <div>
        <Box sx={wrapper(!!error)} onClick={onClick}>
          {children}
        </Box>
        {helperText && (
          <Typography sx={helperTextStyle(!!error)}>{helperText}</Typography>
        )}
      </div>
    );
  }
}

export type Props = {
  children?: React.ReactNode;
  error?: boolean;
  helperText?: React.ReactNode;
  onClick?: () => void;
};
