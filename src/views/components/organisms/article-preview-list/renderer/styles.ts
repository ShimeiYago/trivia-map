import { SxProps } from '@mui/material';

const BG_COLOR = '#f5f8fa';

export const card: SxProps = {
  backgroundColor: BG_COLOR,
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translate(0,-5px)',
  },
};
