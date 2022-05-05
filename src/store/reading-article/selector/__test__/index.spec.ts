import { selectReadingArticleUpdatedAt } from './../index';
import {
  selectReadingArticleContent,
  selectReadingArticleErrorMsg,
  selectReadingArticleId,
  selectReadingArticleLoadingState,
  selectReadingArticleTitle,
  selectReadingArticlePosition,
  selectReadingArticleImageUrl,
  selectReadingArticleUserId,
  selectReadingArticleUserName,
  selectReadingArticleCreatedAt,
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
      userId: '000',
      userName: 'Axel',
      createdAt: '2022/4/1',
      updatedAt: '2022/5/1',
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

  it('selectReadingArticleUserId should return readingArticle userId', () => {
    expect(selectReadingArticleUserId(rootState)).toEqual('000');
  });

  it('selectReadingArticleUserName should return readingArticle userName', () => {
    expect(selectReadingArticleUserName(rootState)).toEqual('Axel');
  });

  it('selectReadingArticleCreatedAt should return readingArticle createdAt', () => {
    expect(selectReadingArticleCreatedAt(rootState)).toEqual('2022/4/1');
  });

  it('selectReadingArticleUpdatedAt should return readingArticle updatedAt', () => {
    expect(selectReadingArticleUpdatedAt(rootState)).toEqual('2022/5/1');
  });

  it('selectReadingArticleLoadingState should return readingArticle loadingState', () => {
    expect(selectReadingArticleLoadingState(rootState)).toEqual('error');
  });

  it('selectReadingArticleErrorMsg should return readingArticle errorMsg', () => {
    expect(selectReadingArticleErrorMsg(rootState)).toEqual('error');
  });
});
