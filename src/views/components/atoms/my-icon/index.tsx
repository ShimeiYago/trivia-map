import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';
import { ReactComponent as MapMarkerIcon } from 'images/svg/map-marker.svg';

export function MyIcon(props: Props): JSX.Element {
  return <SvgIcon inheritViewBox component={MapMarkerIcon} {...props} />;
}

export type Props = SvgIconProps & {
  variant: 'map-marker';
};
