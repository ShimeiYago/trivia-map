import { SxProps } from '@mui/material';

export const closeButton: SxProps = {
  position: 'fixed',
  backgroundColor: 'white',
  display: 'block',
  zIndex: 2,
};

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

export const miniMapTextBox: SxProps = {
  position: 'absolute',
  top: '70%',
  left: '50%',
  width: '90%',
  transform: 'translate(-50%,-50%)',
  zIndex: 2000,
  fontWeight: 'bold',
};
