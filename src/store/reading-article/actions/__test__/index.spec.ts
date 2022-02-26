import { fetchReadingArticle } from '..';
import * as ArticleApiModule from 'api/articles-api';
import { GetArticleResponse } from 'api/articles-api';

const dispatch = jest.fn();
let getRemoteArticleSpy: jest.SpyInstance;

const mockResponse: GetArticleResponse = {
  title: 'title',
  content: 'content',
};

describe('fetchReadingArticle', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getRemoteArticleSpy = jest.spyOn(ArticleApiModule, 'getRemoteArticle');
  });

  it('call fetchStart at first', async () => {
    getRemoteArticleSpy.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchReadingArticle('postId-000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('readingArticle/fetchStart');
  });

  it('call fetchSuccess if API successed', async () => {
    getRemoteArticleSpy.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchReadingArticle('postId-000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('readingArticle/fetchSuccess');
  });

  it('call fetchFailure if API failed', async () => {
    getRemoteArticleSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchReadingArticle('postId-000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('readingArticle/fetchFailure');
  });
});
