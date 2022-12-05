import L from 'leaflet';
import presetIconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import styles from './index.module.css';

import defaultIconUrl from 'images/marker-icons/default.png';
import redIconUrl from 'images/marker-icons/red.png';
import redIconWithNumberUrl from 'images/marker-icons/red-with-number.png';
import ReactDOMServer from 'react-dom/server';

const singleIcon = {
  width: 25,
  height: 41,
};
const duplicatedIcon = {
  width: 33,
  height: 46,
};

const singleIconOptions: L.IconOptions = {
  iconUrl: presetIconUrl,
  shadowUrl: iconShadow,
  iconSize: [singleIcon.width, singleIcon.height],
  iconAnchor: [singleIcon.width / 2, singleIcon.height],
  popupAnchor: [0, -singleIcon.height + 5],
  tooltipAnchor: [0, -singleIcon.height + 5],
};

const duplicatedIconOptions: L.IconOptions = {
  iconUrl: presetIconUrl,
  shadowUrl: iconShadow,
  iconSize: [duplicatedIcon.width, duplicatedIcon.height],
  iconAnchor: [duplicatedIcon.width / 2 + 4, duplicatedIcon.height],
  popupAnchor: [0, -duplicatedIcon.height + 14],
  tooltipAnchor: [0, -duplicatedIcon.height + 14],
};

// export const presetIcon = L.icon(iconOptions);

export const defaultIcon = L.icon({
  ...singleIconOptions,
  iconUrl: defaultIconUrl,
});
export const redIcon = L.icon({
  ...singleIconOptions,
  iconUrl: redIconUrl,
});

// marker with number
export const redIconWithNumber = (num: string) =>
  L.divIcon({
    ...duplicatedIconOptions,
    iconSize: [33, 46],
    className: styles['duplicated-marker-wrapper'],
    html: ReactDOMServer.renderToString(
      <>
        <img src={iconShadow} className={styles['duplicated-marker-shadow']} />
        <img src={redIconWithNumberUrl} className={styles['duplicated-marker-icon']} />
        <div className={styles['duplicated-marker-text']}>{num}</div>
      </>,
    ),
  });
