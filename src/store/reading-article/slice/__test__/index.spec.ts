import { readingArticleReducer, readingArticleSlice } from '..';
import { ReadingArticleState } from './../../model/index';

const { fetchSuccess, fetchFailure, fetchStart } = readingArticleSlice.actions;

describe('readingArticle reducer', () => {
  const initialState: ReadingArticleState = {
    postId: '',
    title: '',
    content: '',
    loadingState: 'waiting',
    position: { lat: 0, lng: 0 },
    imageUrl: null,
    userId: '',
    userName: '',
    createdAt: '',
  };
  const loadingState = Object.assign(initialState, { loadingState: 'loading' });

  it('should handle initial state', () => {
    expect(readingArticleReducer(undefined, { type: 'unknown' })).toEqual({
      postId: '',
      title: '',
      content: '',
      loadingState: 'waiting',
      position: { lat: 0, lng: 0 },
      imageUrl: null,
      userId: '',
      userName: '',
      createdAt: '',
    });
  });
  it('should handle fetchStart', () => {
    const actual = readingArticleReducer(
      initialState,
      fetchStart('postId-000'),
    );
    expect(actual.loadingState).toEqual('loading');
  });

  it('should handle fetchFailure', () => {
    const actual = readingArticleReducer(loadingState, fetchFailure('error'));
    expect(actual.loadingState).toEqual('error');
    expect(actual.errorMsg).toEqual('error');
  });

  it('should handle fetchSuccess', () => {
    const article = {
      title: 'title',
      content: 'content',
      imageDataUrl: 'https://image-data.jpg',
      position: { lat: 0, lng: 0 },
      userId: '000',
      userName: 'Axel',
      createdAt: '2022/4/1',
      updatedAt: '2022/5/1',
    };
    const actual = readingArticleReducer(loadingState, fetchSuccess(article));
    expect(actual.loadingState).toEqual('success');
    expect(actual.title).toEqual('title');
    expect(actual.content).toEqual('content');
    expect(actual.imageUrl).toEqual('https://image-data.jpg');
    expect(actual.position).toEqual({ lat: 0, lng: 0 });
    expect(actual.userId).toEqual('000');
    expect(actual.userName).toEqual('Axel');
    expect(actual.createdAt).toEqual('2022/4/1');
    expect(actual.updatedAt).toEqual('2022/5/1');
  });
});
