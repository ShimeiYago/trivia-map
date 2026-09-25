/* istanbul ignore file */

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

// import svg icons
// please note that you should remove "fill" from .svg files
import { ReactComponent as MapMarkerIcon } from 'images/svg/map-marker.svg';
import { ReactComponent as SpecialMapIcon } from 'images/svg/special-map.svg';
import { ReactComponent as AddSpecialMapIcon } from 'images/svg/add-special-map.svg';
import { ReactComponent as SpecialListIcon } from 'images/svg/special-list.svg';
import { ReactComponent as XTwitterIcon } from 'images/svg/x-twitter.svg';

export function MyIcon(props: Props): JSX.Element {
  let icon: React.FunctionComponent;
  switch (props.variant) {
    case 'map-marker':
      icon = MapMarkerIcon;
      break;
    case 'special-map':
      icon = SpecialMapIcon;
      break;
    case 'add-special-map':
      icon = AddSpecialMapIcon;
      break;
    case 'special-list':
      icon = SpecialListIcon;
      break;
    case 'x-twitter':
      icon = XTwitterIcon;
      break;
  }

  return <SvgIcon inheritViewBox component={icon} {...props} />;
}

export type Props = SvgIconProps & {
  variant: 'map-marker' | 'special-map' | 'add-special-map' | 'special-list' | 'x-twitter';
};
