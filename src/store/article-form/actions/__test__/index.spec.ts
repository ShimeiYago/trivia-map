import { ApiError } from 'api/utils/handle-axios-error';
import { submitNewArticle, submitEdittedArticle, fetchArticle } from '..';
import * as GetArticleApiModule from 'api/articles-api/get-remote-article';
import * as PostArticleApiModule from 'api/articles-api/post-remote-article';
import * as PutArticleApiModule from 'api/articles-api/put-remote-article';

const dispatch = jest.fn();
let getRemoteArticleSpy: jest.SpyInstance;
let postRemoteArticleSpy: jest.SpyInstance;
let putRemoteArticleSpy: jest.SpyInstance;

const formError = {
  headerErrors: ['an error in title'],
  fieldErrors: {
    title: 'title is too long',
  },
};
const apiError: ApiError<PostArticleApiModule.ValidationError> = {
  status: 422,
  data: formError,
  errorMsg: 'validation error',
};

const mockPostPutResponse: PostArticleApiModule.PostArticleResponse = {
  postId: 'postId-000',
};

const getState = () => ({
  articleForm: {
    postId: '000',
    title: 'title',
    content: 'content',
    position: { lat: 0, lng: 0 },
  },
});

describe('submitNewArticle', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    postRemoteArticleSpy = jest.spyOn(
      PostArticleApiModule,
      'postRemoteArticle',
    );
  });

  it('call submitStart at first', async () => {
    postRemoteArticleSpy.mockResolvedValue(mockPostPutResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitNewArticle() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/submitStart');
  });

  it('call submitSuccess if API successed', async () => {
    postRemoteArticleSpy.mockResolvedValue(mockPostPutResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitNewArticle() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/submitSuccess');
  });

  it('call submitFailure if API failed', async () => {
    postRemoteArticleSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitNewArticle() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/submitFailure');
  });

  it('handle validation error', async () => {
    postRemoteArticleSpy.mockRejectedValue(apiError);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitNewArticle() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/submitFailure');
    expect(dispatch.mock.calls[1][0].payload.headerErrors).toBe(
      formError.headerErrors,
    );
    expect(dispatch.mock.calls[1][0].payload.fieldErrors).toBe(
      formError.fieldErrors,
    );
  });
});

describe('submitEdittedArticle', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    putRemoteArticleSpy = jest.spyOn(PutArticleApiModule, 'putRemoteArticle');
  });

  it('call submitStart at first', async () => {
    putRemoteArticleSpy.mockResolvedValue(mockPostPutResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/submitStart');
  });

  it('call submitSuccess if API successed', async () => {
    putRemoteArticleSpy.mockResolvedValue(mockPostPutResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/submitSuccess');
  });

  it('call submitFailure if API failed', async () => {
    putRemoteArticleSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/submitFailure');
  });

  it('handle validation error', async () => {
    putRemoteArticleSpy.mockRejectedValue(apiError);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].payload.headerErrors).toBe(
      formError.headerErrors,
    );
    expect(dispatch.mock.calls[1][0].payload.fieldErrors).toBe(
      formError.fieldErrors,
    );
  });

  it('throw error if post id is not setted', async () => {
    putRemoteArticleSpy.mockRejectedValue(apiError);

    const getStateWithoutId = () => ({
      articleForm: {
        title: 'title',
        content: 'content',
        position: { lat: 0, lng: 0 },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await expect(appThunk(dispatch, getStateWithoutId, {})).rejects.toThrow();
  });
});

const mockGetResponse: GetArticleApiModule.GetArticleResponse = {
  title: 'title',
  content: 'content',
  position: { lat: 0, lng: 0 },
};

describe('fetchArticle', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getRemoteArticleSpy = jest.spyOn(GetArticleApiModule, 'getRemoteArticle');
  });

  it('call fetchStart at first', async () => {
    getRemoteArticleSpy.mockResolvedValue(mockGetResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchArticle('000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/fetchStart');
  });

  it('call fetchSuccess if API successed', async () => {
    getRemoteArticleSpy.mockResolvedValue(mockGetResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchArticle('000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/fetchSuccess');
  });

  it('call fetchFailure if API failed', async () => {
    getRemoteArticleSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchArticle('000') as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/fetchFailure');
  });
});
