import { PreviewListOrder } from 'api/articles-api/get-articles-previews';
import { Park } from 'types/park';

export const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3001';

export const SITE_NAME = 'トリビアマップ';

export const DOMAIN = process.env.REACT_APP_DOMAIN ?? 'https://xxx.com';

export const ANALYTICS_ID = process.env.REACT_APP_ANALYTICS_ID;

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
