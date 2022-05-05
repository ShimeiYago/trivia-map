import { DeleteArticleResponse } from 'api/articles-api/delete-remote-article';
import { GetArticleResponse } from 'api/articles-api/get-remote-article';
import { PostArticleResponse } from 'api/articles-api/post-remote-article';

export const mockGetArticleResponse: GetArticleResponse = {
  title: 'ノーチラス号',
  content: 'ネモ船長が最大の発明だと自負する潜水艇。',
  position: {
    lat: 22.27,
    lng: 29.268,
  },
  imageDataUrl:
    'https://www.disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800.jpg',
  userId: '000',
  userName: 'Axel',
  createdAt: '2022/4/1',
  updatedAt: '2022/5/1',
};

export const mockPostArticleResponse: PostArticleResponse = {
  postId: '100',
};

export const mockDeleteArticleResponse: DeleteArticleResponse = {
  postId: '100',
};
