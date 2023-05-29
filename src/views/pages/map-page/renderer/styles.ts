import { alpha, SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';

const drawerWidth = 500;
const appBarDefaultHeightPC = 66;
const appBarDefaultHeightMobile = 58;
const zIndex = 1000;
const categoryBackgroundColor = alpha('#000', 0.5);
const authorBackgroundColor = alpha('#fff', 0.8);
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

export function parkSelectBox(shrink: boolean, isMobile: boolean): SxProps {
  return {
    margin: 0,
    bottom: 'auto',
    right: 20 + (shrink ? drawerWidth : 0),
    top: (isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC) + 50,
    left: 'auto',
    position: 'fixed',
    zIndex: zIndex,
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

export const authorMapMessage: SxProps = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 25,
  left: 'auto',
  position: 'fixed',
  zIndex: zIndex,
  backgroundColor: authorBackgroundColor,
  pl: 1,
  pr: 3,
  py: 2,
  borderRadius: 1,
  maxWidth: 300,
  boxSizing: 'border-box',
};
