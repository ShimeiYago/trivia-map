import { GetArticleResponse } from 'api/articles-api/get-remote-article';
import { readingArticleReducer, readingArticleSlice } from '..';
import { ReadingArticleState } from './../../model/index';

const { fetchSuccess, fetchFailure, fetchStart } = readingArticleSlice.actions;

describe('readingArticle reducer', () => {
  const initialState: ReadingArticleState = {
    postId: 1,
    title: '',
    description: '',
    loadingState: 'waiting',
    position: {
      lat: 0,
      lng: 0,
      park: 'S',
    },
    imageUrl: null,
    author: {
      userId: 1,
      nickname: '',
    },
    createdAt: '',
    updatedAt: '',
  };
  const loadingState = Object.assign(initialState, { loadingState: 'loading' });

  it('should handle initial state', () => {
    expect(readingArticleReducer(undefined, { type: 'unknown' })).toEqual({
      postId: -1,
      title: '',
      description: '',
      loadingState: 'waiting',
      position: { lat: 0, lng: 0, park: 'L' },
      imageUrl: null,
      author: {
        userId: -1,
        nickname: '',
      },
      createdAt: '',
      updatedAt: '',
    });
  });
  it('should handle fetchStart', () => {
    const actual = readingArticleReducer(initialState, fetchStart(1));
    expect(actual.loadingState).toEqual('loading');
  });

  it('should handle fetchFailure', () => {
    const actual = readingArticleReducer(loadingState, fetchFailure('error'));
    expect(actual.loadingState).toEqual('error');
    expect(actual.errorMsg).toEqual('error');
  });

  it('should handle fetchSuccess', () => {
    const article: GetArticleResponse = {
      postId: 1,
      title: 'title',
      description: 'description',
      imageUrl: 'https://image-data.jpg',
      marker: {
        markerId: 1,
        lat: 0,
        lng: 0,
        park: 'S',
        numberOfPublicArticles: 1,
      },
      author: {
        userId: 1,
        nickname: 'nickname',
      },
      createdAt: '2022/4/1',
      updatedAt: '2022/5/1',
    };
    const actual = readingArticleReducer(loadingState, fetchSuccess(article));
    expect(actual.loadingState).toEqual('success');
    expect(actual.title).toEqual('title');
    expect(actual.description).toEqual('description');
    expect(actual.imageUrl).toEqual('https://image-data.jpg');
    expect(actual.position.lat).toEqual(0);
    expect(actual.author).toEqual({
      userId: 1,
      nickname: 'nickname',
    });
    expect(actual.createdAt).toEqual('2022/4/1');
    expect(actual.updatedAt).toEqual('2022/5/1');
  });
});
