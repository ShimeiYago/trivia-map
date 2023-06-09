import { PreviewListOrder } from 'api/articles-api/get-articles-previews';
import { Park } from 'types/park';

export const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3001';

export const SITE_NAME = 'トリビアマップ';

export const ANALYTICS_ID_ENV_KEY = 'REACT_APP_ANALYTICS_ID';

export const API_TIMEOUT = {
  short: 10000,
  long: 20000,
};

export const MAP_MAX_COORINATE = 255;
export const MAP_MARGIN = 50;

// categoryId should be same as BE
export const CATEGORIES = [
  {
    categoryId: 1,
    categoryName: '隠れミッキー',
  },
  {
    categoryId: 2,
    categoryName: 'バックグラウンドストーリー',
  },
  {
    categoryId: 3,
    categoryName: 'おすすめ写真スポット',
  },
  {
    categoryId: 4,
    categoryName: 'ショーパレ',
  },
  {
    categoryId: 5,
    categoryName: 'キャラグリ',
  },
  {
    categoryId: 6,
    categoryName: 'パーク攻略法',
  },
  // NOTE: '0' should be at end of list
  {
    categoryId: 0,
    categoryName: 'その他',
  },
];

export const ARTICLES_ORDER_OPTIONS: {
  orderKey: PreviewListOrder;
  orderName: string;
}[] = [
  {
    orderKey: 'latest',
    orderName: '投稿日時が新しい順',
  },
  {
    orderKey: 'oldest',
    orderName: '投稿日時が古い順',
  },
  {
    orderKey: 'popular',
    orderName: '閲覧数が多い順',
  },
];

export const INQUIRY_CATEGORIES = [
  '不具合の報告',
  'ご要望',
  'アカウント関連',
  '不正行為の報告',
  'その他',
];

export const UPLOAD_IMAGE_MAX_LENGTH = {
  article: 1000,
  icon: 200,
};

export const TDL_TILE_URL = '/l-tiles/{z}/{x}/{y}.png';
export const TDS_TILE_URL = '/s-tiles/{z}/{x}/{y}.png';

export const ZOOMS = {
  min: 1,
  max: 4,
  default: 2,
  miniMap: 3,
  popupOpen: 3,
};

export const PARKS = {
  land: 'L' as Park,
  sea: 'S' as Park,
};

export const COOKIE_NAME = {
  hasAccessToken: 'has-trivia-map-access-token',
  hasRefreshToken: 'has-trivia-map-resresh-token',
};

export const INPUT_FIELD_MAX_LENGTH = {
  articleTitle: 50,
  articleDescription: 500,
  nickname: 20,
  inquiryMessage: 2000,
};

export const NO_INDEX = process.env.REACT_APP_NO_INDEX;

export const ATTRIBUTION = {
  url: 'https://www.tokyodisneyresort.jp/tdl/map.html',
  text: 'tokyodisneyresort.jp',
};
