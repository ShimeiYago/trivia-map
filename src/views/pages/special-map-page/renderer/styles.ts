import { SxProps } from '@mui/material';
import { mapPageCommonStyle } from 'views/common-styles/map-page';

const { appBarDefaultHeightPC, appBarDefaultHeightMobile, zIndex, floatingBackgroundColor } =
  mapPageCommonStyle;

export function mapWrapper(isMobile: boolean, screenWidth: number, screenHeight: number): SxProps {
  const appBarDefaultHeight = isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC;

  return {
    position: 'relative',
    width: `${screenWidth}px`,
    height: `calc(${screenHeight}px - ${appBarDefaultHeight}px)`,
  };
}

export const mapTopArea = (isMobile: boolean): SxProps => {
  return {
    margin: 0,
    position: 'fixed',
    left: '50%',
    top: (isMobile ? appBarDefaultHeightMobile : appBarDefaultHeightPC) + 10,
    transform: 'translate(-50%, 0)',
    zIndex: zIndex,
    width: '95%',
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
