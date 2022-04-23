import { fetchReadingArticle } from '..';
import * as GetArticleApiModule from 'api/articles-api/get-remote-article';

const dispatch = jest.fn();
let getRemoteArticleSpy: jest.SpyInstance;

const mockResponse: GetArticleApiModule.GetArticleResponse = {
  title: 'title',
  content: 'content',
  imageDataUrl: 'https://image-data.jpg',
  position: { lat: 0, lng: 0 },
};

describe('fetchReadingArticle', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getRemoteArticleSpy = jest.spyOn(GetArticleApiModule, 'getRemoteArticle');
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
