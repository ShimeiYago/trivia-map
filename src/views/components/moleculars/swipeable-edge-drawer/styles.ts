import { SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';

const backgroundColor = '#fff';

export function headStyle(bleedingHeight: number): SxProps {
  return {
    position: 'absolute',
    top: -bleedingHeight,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    visibility: 'visible',
    right: 0,
    left: 0,
    backgroundColor,
  };
}

export const contentStyle: SxProps = {
  height: '100%',
  overflow: 'auto',
  backgroundColor,
  transitionDuration: '1s',
};

export const pullerStyle: SxProps = {
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
};

export const edgeLabelStyle: SxProps = {
  p: 2,
  color: 'text.secondary',
  backgroundColor: '#fff',
};
