import { SxProps } from '@mui/material';

const DrawerWidth = 500;
export const rightDrawerStyle: SxProps = {
  width: DrawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DrawerWidth,
  },
};
