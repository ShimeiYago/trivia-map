import { SxProps } from '@mui/material';

export function paperStyle(variant: 'main' | 'side' | 'navi'): SxProps {
  return {
    paddingY: variant === 'navi' ? 1 : 3,
    paddingX: variant === 'main' ? 3 : 2,
  };
}
