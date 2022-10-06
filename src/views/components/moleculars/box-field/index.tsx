import React from 'react';
import { Box } from '@mui/material';
import { wrapper } from './styles';
import { HelperText } from 'views/components/atoms/helper-text';

export class BoxField extends React.Component<Props> {
  static defaultProps: Props = {
    status: 'normal',
  };

  render() {
    const { children, status, helperText, onClick, disabled } = this.props;

    return (
      <div>
        <Box sx={wrapper(status, disabled)} onClick={disabled ? undefined : onClick}>
          {children}
        </Box>
        {helperText && <HelperText error={status === 'error'}>{helperText}</HelperText>}
      </div>
    );
  }
}

export type Props = {
  children?: React.ReactNode;
  status?: FieldStatus;
  helperText?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export type FieldStatus = 'normal' | 'valid' | 'error';
