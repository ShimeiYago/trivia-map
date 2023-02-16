import { SxProps } from '@mui/material';

const drawerWidth = 250;
const mobileHeight = 56;
const PCHeight = 64;
const localNaviHeight = 40;

export function appBarStyle(permanentLeftNavi: boolean, mapPage: boolean): SxProps {
  return {
    borderBottom: mapPage ? '2px solid rgba(255, 255, 255, 0.7)' : undefined,
    width: permanentLeftNavi ? `calc(100% - ${drawerWidth}px)` : undefined,
    ml: permanentLeftNavi ? `${drawerWidth}px` : undefined,
  };
}

export const leftNaviBox: SxProps = {
  width: drawerWidth,
};

export function contentStyle(
  permanentLeftNavi: boolean,
  mapPage: boolean,
  isMobile: boolean,
  hasLocalNavi: boolean,
  fixedPosition: boolean,
): SxProps {
  let topPadding = !fixedPosition ? 0 : isMobile ? mobileHeight : PCHeight;
  if (hasLocalNavi) {
    topPadding += localNaviHeight;
  }
  return {
    width: permanentLeftNavi ? `calc(100% - ${drawerWidth}px)` : '100%',
    ml: permanentLeftNavi ? `${drawerWidth}px` : undefined,
    pt: mapPage ? undefined : `${topPadding}px`,
    pb: mapPage ? 0 : 4,
  };
}

export function localNavi(
  permanentLeftNavi: boolean,
  mapPage: boolean,
  isMobile: boolean,
): SxProps {
  const topPadding = isMobile ? mobileHeight : PCHeight;

  return {
    ...contentStyle(permanentLeftNavi, mapPage, isMobile, true, true),
    position: 'fixed',
    pt: `${topPadding}px`,
    zIndex: 1000,
  };
}

export function logoImageBox(isMobile: boolean): SxProps {
  return {
    height: isMobile ? mobileHeight : PCHeight,
    flexGrow: 1,
    // py: isMobile ? 1.5 : 2,
    pt: 1,
    pb: 1.5,
    boxSizing: 'border-box',
  };
}
