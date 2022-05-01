import { SxProps } from '@mui/material';

const drawerWidth = 250;

export function appBarStyle(permanentLeftNavi: boolean): SxProps {
  return {
    borderBottom: '2px solid rgba(255, 255, 255, 0.7)',
    width: permanentLeftNavi ? `calc(100% - ${drawerWidth}px)` : undefined,
    ml: permanentLeftNavi ? `${drawerWidth}px` : undefined,
  };
}

export const leftNaviBox: SxProps = {
  width: drawerWidth,
};

export function contentStyle(permanentLeftNavi: boolean): SxProps {
  return {
    width: permanentLeftNavi ? `calc(100% - ${drawerWidth}px)` : undefined,
    ml: permanentLeftNavi ? `${drawerWidth}px` : undefined,
  };
}
