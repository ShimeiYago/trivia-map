import React from 'react';
import { Box, Typography } from '@mui/material';
import { helperTextStyle, wrapper } from './styles';

export class BoxField extends React.Component<Props> {
  static defaultProps: Props = {
    status: 'normal',
  };

  render() {
    const { children, status, helperText, onClick } = this.props;

    return (
      <div>
        <Box sx={wrapper(status)} onClick={onClick}>
          {children}
        </Box>
        {helperText && (
          <Typography sx={helperTextStyle(status)}>{helperText}</Typography>
        )}
      </div>
    );
  }
}

export type Props = {
  children?: React.ReactNode;
  status?: FieldStatus;
  helperText?: React.ReactNode;
  onClick?: () => void;
};

export type FieldStatus = 'normal' | 'valid' | 'error';
