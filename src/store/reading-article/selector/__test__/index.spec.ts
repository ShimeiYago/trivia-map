import {
  selectReadingArticleContent,
  selectReadingArticleErrorMsg,
  selectReadingArticleId,
  selectReadingArticleLoadingState,
  selectReadingArticleTitle,
  selectReadingArticlePosition,
  selectReadingArticleImageUrl,
} from '..';
import { ReadingArticleState } from '../../model';

describe('readingArticle selector', () => {
  const rootState = {
    readingArticle: {
      postId: 'post-id',
      title: 'title',
      content: 'content',
      position: { lat: 1, lng: 0 },
      imageUrl: 'image-url.jpg',
      loadingState: 'error',
      errorMsg: 'error',
    } as ReadingArticleState,
  };

  it('selectReadingArticleId should return readingArticle id', () => {
    expect(selectReadingArticleId(rootState)).toEqual('post-id');
  });

  it('selectReadingArticleTitle should return readingArticle title', () => {
    expect(selectReadingArticleTitle(rootState)).toEqual('title');
  });

  it('selectReadingArticleContent should return readingArticle content', () => {
    expect(selectReadingArticleContent(rootState)).toEqual('content');
  });

  it('selectReadingArticlePosition should return readingArticle position', () => {
    expect(selectReadingArticlePosition(rootState)).toEqual({ lat: 1, lng: 0 });
  });

  it('selectReadingArticleImageUrl should return readingArticle imageUrl', () => {
    expect(selectReadingArticleImageUrl(rootState)).toEqual('image-url.jpg');
  });

  it('selectReadingArticleLoadingState should return readingArticle loadingState', () => {
    expect(selectReadingArticleLoadingState(rootState)).toEqual('error');
  });

  it('selectReadingArticleErrorMsg should return readingArticle errorMsg', () => {
    expect(selectReadingArticleErrorMsg(rootState)).toEqual('error');
  });
});
