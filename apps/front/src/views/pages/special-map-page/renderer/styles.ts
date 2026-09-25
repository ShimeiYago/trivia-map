/* istanbul ignore file */

import { SxProps } from '@mui/material';
import { mapPageStyleConst } from 'views/common-styles/map-page';

const {
  appBarDefaultHeightPC,
  appBarDefaultHeightMobile,
  zIndex,
  floatingBackgroundColor,
  drawerWidth,
} = mapPageStyleConst;

export const mapTopArea = (shrink: boolean, isMobile: boolean): SxProps => {
  const width = shrink ? `calc(100% - ${drawerWidth}px)` : '100%';

  return {
    margin: 0,
    position: 'fixed',
    left: 0,
    top: (isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC) + 10,
    zIndex: zIndex,
    width,
    px: 1,
    boxSizing: 'border-box',
  };
};

export const metaInfoBox: SxProps = {
  backgroundColor: floatingBackgroundColor,
  mb: 1,
  mx: 'auto',
  borderRadius: 1,
  p: 1,
  boxSizing: 'border-box',
  maxWidth: '800px',
};

export const centralizeBox: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  justifyItems: 'center',
  height: '100%',
};
