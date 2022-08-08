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
    lat: 22.27,
    lng: 29.268,
    park: 'S',
    numberOfPublicArticles: 1,
  },
  imageUrl:
    'https://www.disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800.jpg',
  isDraft: false,
  author: {
    userId: 1,
    nickname: 'Axel',
  },
  createdAt: '2022-06-16T21:42:51.202153+09:00',
  updatedAt: '2022-06-16T21:42:51.202153+09:00',
  category: 1,
};

export const mockPostArticleResponse: PostArticleResponse = {
  postId: 1,
  title: 'ノーチラス号',
  description: 'ネモ船長が最大の発明だと自負する潜水艇。',
  marker: 100,
  imageUrl: null,
  isDraft: false,
  author: 0,
  category: 1,
  createdAt: '2022-06-16T21:42:51.202153+09:00',
  updatedAt: '2022-06-16T21:42:51.202153+09:00',
};

export const mockGetArticlesPreviewsResponse: GetArticlesPreviewsResponse = {
  nextUrl: null,
  previousUrl: null,
  totalRecords: 2,
  totalPages: 2,
  currentPage: 1,
  results: [
    {
      postId: 1,
      title: 'ノーチラス号のエンジン',
      imageUrl:
        'https://www.disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800.jpg',
      category: 1,
    },
    {
      postId: 2,
      title: 'ノーチラス号の名前の由来',
      imageUrl: null,
      category: 1,
    },
  ],
};

export const mockGetMyArticlesResponse: GetMyArticlesResponse = {
  nextUrl: null,
  previousUrl: null,
  totalRecords: 2,
  totalPages: 2,
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
      isDraft: false,
      category: 1,
    },
  ],
};
