import { GetArticleResponse } from 'api/articles-api/get-remote-article';
import { PostArticleResponse } from 'api/articles-api/post-remote-article';

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
