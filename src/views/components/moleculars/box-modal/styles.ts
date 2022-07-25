import { SxProps } from '@mui/material';

export const boxStyle: SxProps = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  width: '360px',
  boxShadow: 24,
};
