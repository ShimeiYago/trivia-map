import { SxProps } from '@mui/material';

const red = '#d32f2f';
const grey = '#c4c4c4';

export function wrapper(error: boolean): SxProps {
  return {
    border: 1,
    borderColor: error ? red : grey,
    borderRadius: 3,
    cursor: 'pointer',
    padding: 1,
    '&:hover': {
      borderColor: error ? red : 'black',
    },
  };
}

export function helperTextStyle(error: boolean): SxProps {
  return {
    mt: '3px',
    ml: '14px',
    mr: '14px',
    color: error ? red : '#747474',
    fontSize: '0.75rem',
  };
}
