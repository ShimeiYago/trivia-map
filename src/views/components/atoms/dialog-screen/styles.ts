import { SxProps } from '@mui/material';

export const style = (theme: string, position: string | number, maxWidth?: number): SxProps => {
  let top: string;
  switch (typeof position) {
    case 'string':
      top = position === 'top' ? '10%' : '90%';
      break;
    case 'number':
      top = `${position}%`;
      break;
  }

  return {
    position: 'absolute',
    backgroundColor: theme === 'black' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
    top: top,
    left: '50%',
    maxWidth: maxWidth,
    width: '80%',
    display: 'inline-block',
    transform: 'translate(-50%,-50%)',
    zIndex: 1001,
    p: 2,
    borderRadius: 2,
    color: theme === 'black' ? 'white' : 'black',
  };
};
