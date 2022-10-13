import { PreviewListOrder } from 'api/articles-api/get-articles-previews';
import { Park } from 'types/park';

export const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3001';

export const SITE_NAME = 'トリビアマップ';

export const DOMAIN = process.env.REACT_APP_DOMAIN ?? 'http://127.0.0.1:3000'; // TODO

export const ANALYTICS_ID_ENV_KEY = 'REACT_APP_ANALYTICS_ID';

export const API_TIMEOUT = {
  short: 10000,
  long: 30000,
};

export const CATEGORIES = [
  {
    categoryId: 1,
    categoryName: '隠れミッキー',
  },
  {
    categoryId: 2,
    categoryName: 'バックグラウンドストーリー',
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

export const INQUIRY_CATEGORIES = ['不具合の報告', 'ご要望', 'アカウント関連', 'その他'];

export const UPLOAD_IMAGE_MAX_LENGTH = {
  article: 1000,
  icon: 200,
};

export const TDL_TILE_URL = '/tdl-map-tiles/{z}/{x}/{y}.png';
export const TDS_TILE_URL = '/tds-map-tiles/{z}/{x}/{y}.png';

export const ZOOMS = {
  min: 1,
  max: 4,
  default: 2,
  miniMap: 3,
  popupOpen: 3,
};

export const INITIAL_PARK: Park = 'S';

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
