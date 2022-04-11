import { SxProps } from '@mui/material';

const drawerWidth = 500;
export const rightDrawerStyle: SxProps = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
};

export function mapWrapper(shrink: boolean): SxProps {
  return {
    position: 'relative',
    ...(shrink && {
      width: `calc(100% - ${drawerWidth}px)`,
    }),
  };
}
