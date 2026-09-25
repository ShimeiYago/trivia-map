import { SxProps } from '@mui/material';
import { FieldStatus } from '.';

const red = '#d32f2f';
const grey = '#c4c4c4';
const blue = '#2196f3';

export function wrapper(status?: FieldStatus, disabled?: boolean): SxProps {
  let statusColor;
  switch (status) {
    case 'error':
      statusColor = red;
      break;
    case 'valid':
      statusColor = blue;
      break;
    default:
      statusColor = grey;
  }

  const hoverStyle: SxProps =
    status === 'normal' && !disabled
      ? {
          '&:hover': {
            borderColor: 'black',
          },
        }
      : {};

  return {
    border: 1,
    borderColor: statusColor,
    backgroundColor: statusColor,
    borderRadius: 3,
    cursor: disabled ? 'default' : 'pointer',
    padding: 1,
    ...hoverStyle,
  };
}
