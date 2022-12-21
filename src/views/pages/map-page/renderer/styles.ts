import { alpha, SxProps } from '@mui/material';
import { grey, red, blue } from '@mui/material/colors';
import { Park } from 'types/park';

const drawerWidth = 500;
const appBarDefaultHeightPC = 66;
const appBarDefaultHeightMobile = 58;
const zIndex = 1000;
const categoryBackgroundColor = alpha('#000', 0.5);
const categoryBarProceedButtonWidth = '30px';

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

export function parkSelectBox(shrink: boolean, isMobile: boolean, park: Park): SxProps {
  const switchColor = park === 'L' ? red[700] : blue[700];

  return {
    margin: 0,
    bottom: 'auto',
    right: 20 + (shrink ? drawerWidth : 0),
    top: (isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC) + 50,
    left: 'auto',
    position: 'fixed',
    zIndex: zIndex,
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

export function categoryBar(mobile: boolean, shrink: boolean): SxProps {
  const width = mobile ? '100vw' : shrink ? `calc(100% - ${drawerWidth}px)` : '100%';

  return {
    margin: 0,
    backgroundColor: categoryBackgroundColor,
    position: 'fixed',
    top: (mobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC) + 3,
    zIndex: zIndex,
    width: width,
    display: 'flex',
  };
}

export const categoryBarProceedButton: SxProps = {
  width: categoryBarProceedButtonWidth,
  color: grey[200],
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
};

export const verticalScroll: SxProps = {
  overflowX: 'scroll',
  whiteSpace: 'nowrap',
  width: `calc(100% - ${categoryBarProceedButtonWidth})`,
  borderRight: `2px solid ${grey[200]}`,
  px: 1,
  py: 1,
  boxSizing: 'border-box',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};
