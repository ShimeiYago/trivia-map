import { SxProps } from '@mui/material';

export const wrapper: SxProps = {
  backgroundColor: '#f4f5f7',
};

export function contentWrapper(isMobile: boolean): SxProps {
  return {
    marginTop: isMobile ? 1 : 5,
    marginX: isMobile ? 0 : 10,
  };
}

export const miniMapWrapper: SxProps = {
  position: 'relative',
};

export const miniMapLayer: SxProps = {
  position: 'absolute',
  backgroundColor: 'rgba(0,0,0,0.5)',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 2000,
};
