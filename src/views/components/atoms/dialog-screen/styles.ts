import { SxProps } from '@mui/material';

export const style = (theme: string, position: string): SxProps => {
  return {
    position: 'absolute',
    backgroundColor:
      theme === 'black' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
    top: position === 'top' ? '10%' : '90%',
    left: '50%',
    width: '80%',
    display: 'inline-block',
    transform: 'translate(-50%,-50%)',
    zIndex: 2000,
    p: 2,
    borderRadius: 2,
    color: theme === 'black' ? 'white' : 'black',
  };
};
