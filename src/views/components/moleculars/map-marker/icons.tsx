import L from 'leaflet';
import presetIconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import styles from './index.module.css';
import ReactDOMServer from 'react-dom/server';
import { getSpecialIcon } from 'utils/get-special-icon.ts';

import defaultIconUrl from 'images/marker-icons/default.png';
import redIconUrl from 'images/marker-icons/red.png';
import redIconWithNumberUrl from 'images/marker-icons/red-with-number.png';
import restroomIconUrl from 'images/marker-icons/restroom.png';
import foodIconUrl from 'images/marker-icons/food.png';
import signboardIconUrl from 'images/marker-icons/signboard.png';
import drinkIconUrl from 'images/marker-icons/drink.png';
import hightowerIconUrl from 'images/marker-icons/hightower.png';
import nemoIconUrl from 'images/marker-icons/nemo.png';
import popcoonIconUrl from 'images/marker-icons/popcoon.png';
import seaIconUrl from 'images/marker-icons/sea.png';
import starIconUrl from 'images/marker-icons/star.png';

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
  height: 57,
  centerHeight: 25,
};
const foodIconSize = {
  width: 55,
  height: 57,
  centerHeight: 27,
};
const signboardIconSize = {
  width: 55,
  height: 40,
  centerHeight: 17,
};
const drinkIconSize = {
  width: 55,
  height: 54,
  centerHeight: 25,
};
const hightowerIconSize = {
  width: 55,
  height: 56,
  centerHeight: 26,
};
const nemoIconSize = {
  width: 55,
  height: 55,
  centerHeight: 26,
};
const popcoonIconSize = {
  width: 55,
  height: 56,
  centerHeight: 26,
};
const seaIconSize = {
  width: 55,
  height: 55,
  centerHeight: 25,
};
const starIconSize = {
  width: 55,
  height: 52,
  centerHeight: 28,
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
export const restroomIcon = getSpecialIcon(restroomIconUrl, restroomIconSize);
export const foodIcon = getSpecialIcon(foodIconUrl, foodIconSize);
export const signboardIcon = getSpecialIcon(signboardIconUrl, signboardIconSize);
export const drinkIcon = getSpecialIcon(drinkIconUrl, drinkIconSize);
export const hightowerIcon = getSpecialIcon(hightowerIconUrl, hightowerIconSize);
export const nemoIcon = getSpecialIcon(nemoIconUrl, nemoIconSize);
export const popcoonIcon = getSpecialIcon(popcoonIconUrl, popcoonIconSize);
export const seaIcon = getSpecialIcon(seaIconUrl, seaIconSize);
export const starIcon = getSpecialIcon(starIconUrl, starIconSize);

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
