import { SxProps } from '@mui/material';

const drawerWidth = 500;
const appBarDefaultHeightPC = '64px';
const appBarDefaultHeightMobile = '56px';

export const rightDrawerStyle: SxProps = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
};

export function mapWrapper(shrink: boolean, isMobile: boolean): SxProps {
  const appBarDefaultHeight = isMobile
    ? appBarDefaultHeightMobile
    : appBarDefaultHeightPC;

  return {
    position: 'relative',
    height: `calc(100vh - ${appBarDefaultHeight})`,
    ...(shrink && {
      width: `calc(100% - ${drawerWidth}px)`,
    }),
  };
}
