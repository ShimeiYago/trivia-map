import { GetArticlesPreviewsResponse } from 'api/articles-api/get-articles-previews';
import { GetMyArticlesResponse } from 'api/articles-api/get-my-articles';
import { GetArticleResponse } from 'api/articles-api/get-remote-article';
import { PostArticleResponse } from 'api/articles-api/post-remote-article';

export const mockGetArticleResponse: GetArticleResponse = {
  postId: 1,
  title: 'ノーチラス号',
  description: 'ネモ船長が最大の発明だと自負する潜水艇。',
  marker: {
    markerId: 1,
    lat: -111.33,
    lng: 149.243,
    park: 'S',
    numberOfPublicArticles: { total: 4, eachCategory: [1, 2, 1] },
    areaNames: ['シー', 'メディテレーニアンハーバー', 'ポルトパラディーゾ'],
  },
  image: 'https://disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800.jpg',
  isDraft: false,
  author: {
    userId: 1,
    nickname: 'Axel',
    icon: 'https://disneyparkstory.com/wp-content/uploads/2017/09/apple-touch-icon.png',
  },
  createdAt: '2022/06/16 21:42',
  updatedAt: '2022/06/16 21:42',
  category: 1,
  numberOfLikes: 1,
};

export const mockPostArticleResponse: PostArticleResponse = {
  postId: 1,
  title: 'ノーチラス号',
  description: 'ネモ船長が最大の発明だと自負する潜水艇。',
  marker: 100,
  image: null,
  isDraft: false,
  author: 0,
  category: 1,
  createdAt: '2022/06/16 21:42',
  updatedAt: '2022/06/16 21:42',
};

export const mockGetArticlesPreviewsResponse: GetArticlesPreviewsResponse = {
  nextUrl: null,
  previousUrl: null,
  totalRecords: 2,
  totalPages: 2,
  currentPage: 1,
  startIndex: 1,
  endIndex: 1,
  results: [
    {
      postId: 1,
      title: 'ノーチラス号のエンジン',
      image: 'https://disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800.jpg',
      category: 1,
      createdAt: '2022/06/16 21:42',
      numberOfLikes: 1,
    },
    {
      postId: 2,
      title: 'ノーチラス号の名前の由来',
      image: null,
      category: 1,
      createdAt: '2022/06/16 21:42',
      numberOfLikes: 1,
    },
  ],
};

export const mockGetMyArticlesResponse: GetMyArticlesResponse = {
  nextUrl: null,
  previousUrl: null,
  totalRecords: 2,
  totalPages: 2,
  startIndex: 1,
  endIndex: 1,
  currentPage: 1,
  results: [
    {
      postId: 1,
      title: 'ノーチラス号のエンジン',
      isDraft: false,
      category: 1,
    },
    {
      postId: 2,
      title: 'ノーチラス号の名前の由来',
      isDraft: true,
      category: 1,
    },
  ],
};
