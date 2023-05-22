import { GetSpecialMapsResponseWithPagination } from 'api/special-map-api';

export const mockGetSpecialMapsResponseWithPagination: GetSpecialMapsResponseWithPagination = {
  nextUrl: null,
  previousUrl: null,
  totalRecords: 2,
  totalPages: 2,
  currentPage: 1,
  startIndex: 1,
  endIndex: 1,
  results: [
    {
      specialMapId: 1,
      title: 'トイレマップ',
      thumbnail: 'https://www.yuu-diaryblog.com/wp-content/uploads/2017/06/disney-wc.jpg',
      isPublic: true,
      description: '定番から穴場まで、ディズニーのトイレマップです。',
    },
    {
      specialMapId: 2,
      title: '「関係者以外立ち入り禁止」看板マップ',
      thumbnail: null,
      isPublic: true,
      description: 'パーク中の「関係者以外立ち入り禁止」の看板のまとめです。',
    },
  ],
};
