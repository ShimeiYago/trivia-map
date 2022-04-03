import { GetArticleResponse, PostArticleResponse } from 'api/articles-api';

export const mockGetArticleResponse: GetArticleResponse = {
  title: 'ノーチラス号',
  content: 'ネモ船長が最大の発明だと自負する潜水艇。',
  position: {
    lat: 22.27,
    lng: 29.268,
  },
};

export const mockPostArticleResponse: PostArticleResponse = {
  postId: '100',
};
