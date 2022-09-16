import { SxProps } from '@mui/material';

const drawerWidth = 250;
const mobileHeight = 56;
const PCHeight = 64;
const localNaviHeight = 40;

export function appBarStyle(
  permanentLeftNavi: boolean,
  mapPage: boolean,
): SxProps {
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
): SxProps {
  let topPadding = isMobile ? mobileHeight : PCHeight;
  if (hasLocalNavi) {
    topPadding += localNaviHeight;
  }
  return {
    width: permanentLeftNavi ? `calc(100% - ${drawerWidth}px)` : '100%',
    ml: permanentLeftNavi ? `${drawerWidth}px` : undefined,
    pt: mapPage ? undefined : `${topPadding}px`,
  };
}

export function localNavi(
  permanentLeftNavi: boolean,
  mapPage: boolean,
  isMobile: boolean,
): SxProps {
  const topPadding = isMobile ? mobileHeight : PCHeight;

  return {
    ...contentStyle(permanentLeftNavi, mapPage, isMobile, true),
    position: 'fixed',
    pt: `${topPadding}px`,
    zIndex: 1000,
  };
}
