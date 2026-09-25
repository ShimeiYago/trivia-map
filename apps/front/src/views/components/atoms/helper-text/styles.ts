import { SxProps } from '@mui/material';

export function helperTextStyle(error: boolean): SxProps {
  return {
    mt: '3px',
    ml: '14px',
    mr: '14px',
    color: error ? '#d32f2f' : '#747474',
    fontSize: '0.75rem',
  };
}
