import { SxProps, alpha } from '@mui/material';

export const mapPageStyleConst = {
  appBarDefaultHeightPC: 66,
  appBarDefaultHeightMobile: 58,
  zIndex: 1000,
  drawerWidth: 500,
  floatingBackgroundColor: alpha('#fff', 0.9),
};
const { appBarDefaultHeightPC, appBarDefaultHeightMobile, drawerWidth } = mapPageStyleConst;

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

export function mapWrapper(isMobile: boolean, screenWidth: number, screenHeight: number): SxProps {
  const appBarDefaultHeight = isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC;

  return {
    position: 'relative',
    width: `${screenWidth}px`,
    height: `calc(${screenHeight}px - ${appBarDefaultHeight}px)`,
  };
}
