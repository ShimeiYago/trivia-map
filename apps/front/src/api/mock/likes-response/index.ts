import { ToggleLikeResponse } from './../../likes-api/toggle-like';
import { CheckLikeStatusResponse } from 'api/likes-api/check-like-status';
import { GetLikedArticlesPreviewsResponse } from 'api/likes-api/get-liked-articles-previews';

export const mockCheckLikeStatusResponse: CheckLikeStatusResponse = {
  haveLiked: true,
};

export const mockToggleLikeResponse: ToggleLikeResponse = {
  haveLiked: true,
};

export const mockGetLikedArticlesPreviewsResponse: GetLikedArticlesPreviewsResponse = {
  nextUrl: null,
  previousUrl: null,
  totalRecords: 2,
  totalPages: 2,
  currentPage: 1,
  startIndex: 1,
  endIndex: 1,
  results: [
    {
      article: {
        postId: 1,
        title: 'ノーチラス号のエンジン',
        image: 'https://disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800.jpg',
        category: 1,
        createdAt: '2022/06/16 21:42',
        numberOfGoods: 1,
      },
    },
    {
      article: {
        postId: 2,
        title: 'ノーチラス号の名前の由来',
        image: null,
        category: 1,
        createdAt: '2022/06/16 21:42',
        numberOfGoods: 1,
      },
    },
  ],
};
