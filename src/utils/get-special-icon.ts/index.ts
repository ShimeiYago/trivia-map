/* istanbul ignore file */

import L from 'leaflet';

export function getSpecialIcon(url: string, size: IconSize) {
  return L.icon({
    iconUrl: url,
    iconSize: [size.width, size.height],
    iconAnchor: [size.width / 2, size.centerHeight],
    popupAnchor: [0, -10],
    tooltipAnchor: [0, -10],
  });
}

type IconSize = {
  width: number;
  height: number;
  centerHeight: number;
};
