import { SxProps } from '@mui/material';
import { mapPageCommonStyle } from 'views/common-styles/map-page';

const { appBarDefaultHeightPC, appBarDefaultHeightMobile, zIndex, authorBackgroundColor } =
  mapPageCommonStyle;

export function mapWrapper(isMobile: boolean, screenWidth: number, screenHeight: number): SxProps {
  const appBarDefaultHeight = isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC;

  return {
    position: 'relative',
    width: `${screenWidth}px`,
    height: `calc(${screenHeight}px - ${appBarDefaultHeight}px)`,
  };
}

export function parkSelectBox(isMobile: boolean): SxProps {
  return {
    margin: 0,
    bottom: 'auto',
    right: 20,
    top: (isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC) + 50,
    left: 'auto',
    position: 'fixed',
    zIndex: zIndex,
  };
}

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
