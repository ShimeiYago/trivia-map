import { readingArticleReducer, readingArticleSlice } from '..';
import { ReadingArticleState } from './../../model/index';

const { fetchSuccess, fetchFailure, fetchStart } = readingArticleSlice.actions;

describe('readingArticle reducer', () => {
  const initialState: ReadingArticleState = {
    postId: '',
    title: '',
    content: '',
    loadingState: 'waiting',
  };
  const loadingState = Object.assign(initialState, { loadingState: 'loading' });

  it('should handle initial state', () => {
    expect(readingArticleReducer(undefined, { type: 'unknown' })).toEqual({
      postId: '',
      title: '',
      content: '',
      loadingState: 'waiting',
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
      position: { lat: 0, lng: 0 },
    };
    const actual = readingArticleReducer(loadingState, fetchSuccess(article));
    expect(actual.loadingState).toEqual('success');
    expect(actual.title).toEqual('title');
    expect(actual.content).toEqual('content');
  });
});
