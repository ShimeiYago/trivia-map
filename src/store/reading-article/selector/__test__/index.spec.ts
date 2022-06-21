import { selectReadingArticleUpdatedAt } from './../index';
import {
  selectReadingArticleDescription,
  selectReadingArticleErrorMsg,
  selectReadingArticleId,
  selectReadingArticleLoadingState,
  selectReadingArticleTitle,
  selectReadingArticlePosition,
  selectReadingArticleImageUrl,
  selectReadingArticleAuthor,
  selectReadingArticleCreatedAt,
} from '..';
import { ReadingArticleState } from '../../model';

describe('readingArticle selector', () => {
  const rootState = {
    readingArticle: {
      postId: 1,
      title: 'title',
      description: 'description',
      imageUrl: 'https://image-data.jpg',
      position: {
        lat: 0,
        lng: 0,
        park: 'S',
      },
      author: {
        userId: 1,
        nickname: 'nickname',
      },
      createdAt: '2022/4/1',
      updatedAt: '2022/5/1',
      loadingState: 'error',
      errorMsg: 'error',
    } as ReadingArticleState,
  };

  it('selectReadingArticleId should return readingArticle id', () => {
    expect(selectReadingArticleId(rootState)).toEqual(1);
  });

  it('selectReadingArticleTitle should return readingArticle title', () => {
    expect(selectReadingArticleTitle(rootState)).toEqual('title');
  });

  it('selectReadingArticleDescription should return readingArticle description', () => {
    expect(selectReadingArticleDescription(rootState)).toEqual('description');
  });

  it('selectReadingArticlePosition should return readingArticle position', () => {
    expect(selectReadingArticlePosition(rootState)).toEqual({
      lat: 0,
      lng: 0,
      park: 'S',
    });
  });

  it('selectReadingArticleImageUrl should return readingArticle imageUrl', () => {
    expect(selectReadingArticleImageUrl(rootState)).toEqual(
      'https://image-data.jpg',
    );
  });

  it('selectReadingArticleAuthor should return readingArticle userId', () => {
    expect(selectReadingArticleAuthor(rootState)).toEqual({
      userId: 1,
      nickname: 'nickname',
    });
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
