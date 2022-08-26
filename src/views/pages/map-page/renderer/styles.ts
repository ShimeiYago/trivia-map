import { SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';

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

export function parkSelectBox(shrink: boolean): SxProps {
  return {
    margin: 0,
    bottom: 'auto',
    right: 20 + (shrink ? drawerWidth : 0),
    top: 70,
    left: 'auto',
    position: 'fixed',
    zIndex: 1000,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: grey[500],
    borderRadius: 2,
    padding: 1,
  };
}
