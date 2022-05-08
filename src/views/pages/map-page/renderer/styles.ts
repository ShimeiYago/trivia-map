import { SxProps } from '@mui/material';

const drawerWidth = 500;
const appBarDefaultHeightPC = '66px';
const appBarDefaultHeightMobile = '58px';

export const rightDrawerStyle: SxProps = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
};

export function wrapper(shrink: boolean): SxProps {
  return {
    ...(shrink && {
      width: `calc(100% - ${drawerWidth}px)`,
    }),
  };
}

export function mapWrapper(isMobile: boolean): SxProps {
  const appBarDefaultHeight = isMobile
    ? appBarDefaultHeightMobile
    : appBarDefaultHeightPC;

  return {
    position: 'relative',
    height: `calc(100vh - ${appBarDefaultHeight})`,
  };
}
