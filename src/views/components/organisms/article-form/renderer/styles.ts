import { SxProps } from '@mui/material';

export const formHeader: SxProps = {
  width: '100%',
  backgroundColor: 'white',
  display: 'block',
  pl: 1,
  pt: 1,
};

export const formContainer: SxProps = {
  p: 3,
  overflow: 'scroll',
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
