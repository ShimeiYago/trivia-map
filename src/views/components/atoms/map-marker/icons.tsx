import L from 'leaflet';
import presetIconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import defaultIconUrl from 'images/marker-icons/default.png';
import redIconUrl from 'images/marker-icons/red.png';

const iconWidth = 25;
const iconHeight = 41;

const iconOptions: L.IconOptions = {
  iconUrl: presetIconUrl,
  shadowUrl: iconShadow,
  iconSize: [iconWidth, iconHeight],
  iconAnchor: [iconWidth / 2, iconHeight],
  popupAnchor: [0, -iconHeight + 5],
};

// export const presetIcon = L.icon(iconOptions);

export const defaultIcon = L.icon({
  ...iconOptions,
  iconUrl: defaultIconUrl,
});
export const redIcon = L.icon({
  ...iconOptions,
  iconUrl: redIconUrl,
});
