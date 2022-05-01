import { SxProps } from '@mui/material';

export const wrapper: SxProps = {
  backgroundColor: '#f4f5f7',
  height: '100vh',
};

export function contentWrapper(isMobile: boolean): SxProps {
  return {
    marginTop: isMobile ? 1 : 5,
    marginX: isMobile ? 0 : 10,
  };
}
