import { SxProps } from '@mui/material';
import { grey, red, blue } from '@mui/material/colors';
import { Park } from 'types/park';

const drawerWidth = 500;
const appBarDefaultHeightPC = 66;
const appBarDefaultHeightMobile = 58;

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
    height: `calc(100vh - ${appBarDefaultHeight}px)`,
  };
}

export function parkSelectBox(
  shrink: boolean,
  isMobile: boolean,
  park: Park,
): SxProps {
  const switchColor = park === 'L' ? red[700] : blue[700];

  return {
    margin: 0,
    bottom: 'auto',
    right: 20 + (shrink ? drawerWidth : 0),
    top: (isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC) + 50,
    left: 'auto',
    position: 'fixed',
    zIndex: 1000,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: grey[500],
    borderRadius: 2,
    padding: 1,
    '& .MuiSwitch-thumb': {
      backgroundColor: switchColor,
    },
    '& .MuiSwitch-track': {
      backgroundColor: switchColor,
    },
  };
}

export function categoryButtons(shrink: boolean, isMobile: boolean): SxProps {
  return {
    margin: 0,
    position: 'fixed',
    top: (isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC) + 10,
    ...(!isMobile && { left: '50%', transform: 'translate(-50%, 0%)' }),
    zIndex: 1000,
    ...(shrink && {
      width: `calc(100% - ${drawerWidth}px)`,
    }),
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
    px: 1,
    py: 0,
    boxSizing: 'border-box',
    maxWidth: '100vw',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  };
}
