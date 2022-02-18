import {
  selectReadingArticleContent,
  selectReadingArticleErrorMsg,
  selectReadingArticleId,
  selectReadingArticleLoadingState,
  selectReadingArticleTitle,
} from '..';
import { ReadingArticleState } from '../../model';

describe('readingArticle selector', () => {
  const rootState = {
    readingArticle: {
      postId: 'post-id',
      title: 'title',
      content: 'content',
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

  it('selectReadingArticleLoadingState should return readingArticle loadingState', () => {
    expect(selectReadingArticleLoadingState(rootState)).toEqual('error');
  });

  it('selectReadingArticleErrorMsg should return readingArticle errorMsg', () => {
    expect(selectReadingArticleErrorMsg(rootState)).toEqual('error');
  });
});
