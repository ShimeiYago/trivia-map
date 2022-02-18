import { fetchReadingArticle } from '..';
import * as MarkersApiModule from 'api/articles-api';
import { GetArticleResponse } from 'api/articles-api';

const dispatch = jest.fn();
let getRemoteMarkersSpy: jest.SpyInstance;

const mockResponse: GetArticleResponse = {
  title: 'title',
  content: 'content',
};

describe('fetchReadingArticle', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getRemoteMarkersSpy = jest.spyOn(MarkersApiModule, 'getRemoteArticle');
  });

  it('call fetchStart at first', async () => {
    getRemoteMarkersSpy.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchReadingArticle('postId-000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('readingArticle/fetchStart');
  });

  it('call fetchSuccess if API successed', async () => {
    getRemoteMarkersSpy.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchReadingArticle('postId-000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('readingArticle/fetchSuccess');
  });

  it('call fetchFailure if API failed', async () => {
    getRemoteMarkersSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchReadingArticle('postId-000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('readingArticle/fetchFailure');
  });
});
