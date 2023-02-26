export const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3001';

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

export const UPLOAD_IMAGE_MAX_LENGTH = 1000;

export const TDL_TILE_URL = '/l-tiles/{z}/{x}/{y}.png';
export const TDS_TILE_URL = '/s-tiles/{z}/{x}/{y}.png';
