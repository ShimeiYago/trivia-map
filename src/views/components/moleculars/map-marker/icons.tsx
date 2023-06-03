import L from 'leaflet';
import presetIconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import styles from './index.module.css';

import defaultIconUrl from 'images/marker-icons/default.png';
import redIconUrl from 'images/marker-icons/red.png';
import redIconWithNumberUrl from 'images/marker-icons/red-with-number.png';
import restroomIconUrl from 'images/marker-icons/restroom.png';
import ReactDOMServer from 'react-dom/server';

const singleIconSize = {
  width: 25,
  height: 41,
};
const duplicatedIconSize = {
  width: 33,
  height: 46,
};

const restroomIconSize = {
  width: 60,
  height: 70,
};

const singleIconOptions: L.IconOptions = {
  iconUrl: presetIconUrl,
  shadowUrl: iconShadow,
  iconSize: [singleIconSize.width, singleIconSize.height],
  iconAnchor: [singleIconSize.width / 2, singleIconSize.height],
  popupAnchor: [0, -singleIconSize.height + 5],
  tooltipAnchor: [0, -singleIconSize.height + 5],
};

// const duplicatedIconOptions: L.IconOptions = {

// };

// export const presetIcon = L.icon(iconOptions);

export const defaultIcon = L.icon({
  ...singleIconOptions,
  iconUrl: defaultIconUrl,
});
export const redIcon = L.icon({
  ...singleIconOptions,
  iconUrl: redIconUrl,
});

export const restroomIcon = L.icon({
  iconUrl: restroomIconUrl,
  iconSize: [restroomIconSize.width, restroomIconSize.height],
  iconAnchor: [restroomIconSize.width / 2, restroomIconSize.height / 2],
  popupAnchor: [0, -10],
  tooltipAnchor: [0, -10],
});

// marker with number
export const redIconWithNumber = (num: string) =>
  L.divIcon({
    iconUrl: presetIconUrl,
    shadowUrl: iconShadow,
    iconSize: [duplicatedIconSize.width, duplicatedIconSize.height],
    iconAnchor: [duplicatedIconSize.width / 2 + 4, duplicatedIconSize.height],
    popupAnchor: [0, -duplicatedIconSize.height + 14],
    tooltipAnchor: [0, -duplicatedIconSize.height + 14],
    className: styles['duplicated-marker-wrapper'],
    html: ReactDOMServer.renderToString(
      <>
        <img src={iconShadow} className={styles['duplicated-marker-shadow']} />
        <img src={redIconWithNumberUrl} className={styles['duplicated-marker-icon']} />
        <div className={styles['duplicated-marker-text']}>{num}</div>
      </>,
    ),
  });
