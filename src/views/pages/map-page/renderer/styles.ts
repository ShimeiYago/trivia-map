import { alpha, SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { mapPageStyleConst } from 'views/common-styles/map-page';

const {
  appBarDefaultHeightPC,
  appBarDefaultHeightMobile,
  zIndex,
  drawerWidth,
  floatingBackgroundColor,
} = mapPageStyleConst;

const categoryBackgroundColor = alpha('#000', 0.5);
const categoryBarProceedButtonWidth = '30px';

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
  backgroundColor: floatingBackgroundColor,
  pl: 1,
  pr: 3,
  py: 2,
  borderRadius: 1,
  maxWidth: 300,
  boxSizing: 'border-box',
};

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
