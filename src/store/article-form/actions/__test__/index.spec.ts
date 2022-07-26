import { ApiError } from 'api/utils/handle-axios-error';
import {
  submitNewArticle,
  submitEdittedArticle,
  fetchArticle,
  updateFormField,
} from '..';
import * as GetArticleApiModule from 'api/articles-api/get-remote-article';
import * as PostArticleApiModule from 'api/articles-api/post-remote-article';
import * as PutArticleApiModule from 'api/articles-api/put-remote-article';
import { Position } from 'types/position';

const dispatch = jest.fn();
let getRemoteArticleSpy: jest.SpyInstance;
let postRemoteArticleSpy: jest.SpyInstance;
let putRemoteArticleSpy: jest.SpyInstance;

const formError = {
  title: ['title is too long'],
};
const apiError: ApiError<PostArticleApiModule.ValidationError> = {
  status: 400,
  data: formError,
  errorMsg: 'validation error',
};

const mockPostPutResponse = {
  postId: 100,
  marker: 1,
} as PostArticleApiModule.PostArticleResponse;

const getState = () => ({
  articleForm: {
    postId: 100,
    title: 'title',
    description: 'description',
    position: {
      lat: 0,
      lng: 0,
      park: 'S',
    },
    imageDataUrl: 'https://image-data.jpg',
    previousMarkerId: 1,
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

  it('call submitSuccess if API successed if position is undefined', async () => {
    postRemoteArticleSpy.mockResolvedValue({
      ...mockPostPutResponse,
    });

    const getStateWithoutPosition = () => ({
      articleForm: {
        postId: '000',
        title: 'title',
        description: 'description',
        position: undefined,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitNewArticle() as any;
    await appThunk(dispatch, getStateWithoutPosition, {});

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
    expect(dispatch.mock.calls[1][0].payload).toEqual({
      ...formError,
      errorTitle: '入力内容に誤りがあります。',
    });
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

  it('call submitSuccess if API successed if position is undefined', async () => {
    putRemoteArticleSpy.mockResolvedValue(mockPostPutResponse);

    const getStateWithoutPosition = () => ({
      articleForm: {
        postId: 1,
        title: 'title',
        description: 'description',
        position: undefined,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getStateWithoutPosition, {});

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

    expect(dispatch.mock.calls[1][0].payload).toEqual({
      ...formError,
      errorTitle: '入力内容に誤りがあります。',
    });
  });

  it('call pushMarker if marker is replaced', async () => {
    const mockPostPutResponseWithMarker2 = {
      postId: 100,
      marker: 2,
    } as PostArticleApiModule.PostArticleResponse;

    putRemoteArticleSpy.mockResolvedValue(mockPostPutResponseWithMarker2);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getState, {});
  });
});

const mockGetResponse: GetArticleApiModule.GetArticleResponse = {
  postId: 1,
  title: 'title',
  description: 'description',
  imageUrl: 'https://image-data.jpg',
  isDraft: false,
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

describe('fetchArticle', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getRemoteArticleSpy = jest.spyOn(GetArticleApiModule, 'getRemoteArticle');
  });

  it('call fetchStart at first', async () => {
    getRemoteArticleSpy.mockResolvedValue(mockGetResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchArticle(1) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/fetchStart');
  });

  it('call fetchSuccess if API successed', async () => {
    getRemoteArticleSpy.mockResolvedValue(mockGetResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchArticle(1) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/fetchSuccess');
  });

  it('call fetchFailure if API failed', async () => {
    getRemoteArticleSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchArticle(1) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('articleForm/fetchFailure');
  });
});

describe('updateFormField', () => {
  it('should call updateTitle actions', async () => {
    const param = {
      title: 'title',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = updateFormField(param) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/updateTitle');
  });

  it('should call updateDescription actions', async () => {
    const param = {
      description: 'description',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = updateFormField(param) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe(
      'articleForm/updateDescription',
    );
  });

  it('should call updatePosition actions', async () => {
    const param = {
      position: {
        lat: 0,
        lng: 0,
        park: 'S',
      } as Position,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = updateFormField(param) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/updatePosition');
  });

  it('should call updateImageDataUrl actions', async () => {
    const param = {
      imageDataUrl: 'https://image-data.jpg',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = updateFormField(param) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe(
      'articleForm/updateImageDataUrl',
    );
  });

  it('should call updateIsDraft actions', async () => {
    const param = {
      isDraft: true,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = updateFormField(param) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/updateIsDraft');
  });
});
