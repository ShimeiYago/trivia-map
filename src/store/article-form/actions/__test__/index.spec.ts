import { ApiError } from 'api/utils/handle-axios-error';
import {
  submitNewArticle,
  submitEdittedArticle,
  fetchArticle,
  updateFormField,
  getAndUpdateAreaNames,
} from '..';
import * as GetArticleApiModule from 'api/articles-api/get-remote-article';
import * as PostArticleApiModule from 'api/articles-api/post-remote-article';
import * as PutArticleApiModule from 'api/articles-api/put-remote-article';
import * as GuessAreaModule from 'api/guess-area';
import { Position } from 'types/position';

const dispatch = jest.fn();
let getRemoteArticleSpy: jest.SpyInstance;
let postRemoteArticleSpy: jest.SpyInstance;
let putRemoteArticleSpy: jest.SpyInstance;
let guessAreaSpy: jest.SpyInstance;

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
    image: null,
    previousMarkerId: 1,
    isDraft: false,
  },
});

describe('submitNewArticle', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    postRemoteArticleSpy = jest.spyOn(PostArticleApiModule, 'postRemoteArticle');
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

  it('call submitSuccess if API successed if image is provided', async () => {
    postRemoteArticleSpy.mockResolvedValue(mockPostPutResponse);

    const getStateWithImage = () => ({
      articleForm: {
        ...getState().articleForm,
        image: 'data:image/png;base64,xxx',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitNewArticle() as any;
    await appThunk(dispatch, getStateWithImage, {});

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

  it('do not call pushMarker if isDraft is true', async () => {
    postRemoteArticleSpy.mockResolvedValue({
      ...mockPostPutResponse,
    });

    const getStateWithDraft = () => ({
      articleForm: {
        postId: '000',
        title: 'title',
        description: 'description',
        position: {
          lat: 0,
          lng: 0,
          park: 'S',
        },
        isDraft: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitNewArticle() as any;
    await appThunk(dispatch, getStateWithDraft, {});

    expect(dispatch.mock.calls[dispatch.mock.calls.length - 1][0].type).toBe(
      'articleForm/initialize',
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

  it('call submitSuccess if API successed if image is provided', async () => {
    putRemoteArticleSpy.mockResolvedValue(mockPostPutResponse);

    const getStateWithImage = () => ({
      articleForm: {
        ...getState().articleForm,
        image: 'data:image/png;base64,xxx',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getStateWithImage, {});

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

  it('do not call pushMarker if post is draft', async () => {
    const mockPostPutResponseWithMarker2 = {
      postId: 100,
      marker: 2,
    } as PostArticleApiModule.PostArticleResponse;

    const getStateWithDraft = () => ({
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
        previousMarkerId: 2,
        isDraft: true,
      },
    });

    putRemoteArticleSpy.mockResolvedValue(mockPostPutResponseWithMarker2);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getStateWithDraft, {});

    expect(dispatch.mock.calls[dispatch.mock.calls.length - 1][0].type).toBe(undefined);
  });

  it('do not anything after initialize if previousMarkerId is undefined', async () => {
    const mockPostPutResponseWithMarker2 = {
      postId: 100,
      marker: 2,
    } as PostArticleApiModule.PostArticleResponse;

    const getStateWithoutPreviousPosition = () => ({
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
        previousMarkerId: undefined,
      },
    });

    putRemoteArticleSpy.mockResolvedValue(mockPostPutResponseWithMarker2);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = submitEdittedArticle() as any;
    await appThunk(dispatch, getStateWithoutPreviousPosition, {});

    expect(dispatch.mock.calls[dispatch.mock.calls.length - 1][0].type).toBe(
      'articleForm/initialize',
    );
  });
});

const mockGetResponse: GetArticleApiModule.GetArticleResponse = {
  postId: 1,
  title: 'title',
  description: 'description',
  image: 'https://image-data.jpg',
  isDraft: false,
  marker: {
    markerId: 1,
    lat: 0,
    lng: 0,
    park: 'S',
    numberOfPublicArticles: 1,
    areaNames: ['xxx', 'yyy'],
  },
  author: {
    userId: 1,
    nickname: 'nickname',
    icon: null,
  },
  category: 1,
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

  it('call fetchFailure if API failed with 404 error', async () => {
    getRemoteArticleSpy.mockRejectedValue({ status: 404 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchArticle(1) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('globalError/throwError');
  });

  it('call fetchFailure if API failed', async () => {
    getRemoteArticleSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchArticle(1) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[1][0].type).toBe('globalError/throwError');
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

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/updateDescription');
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

  it('should call updateImage actions', async () => {
    const param = {
      image: {
        dataUrl: 'dataxxx',
        fileName: 'filename',
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = updateFormField(param) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/updateImage');
  });

  it('should call updateCategory actions', async () => {
    const param = {
      category: 1,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = updateFormField(param) as any;
    await appThunk(dispatch);

    expect(dispatch.mock.calls[0][0].type).toBe('articleForm/updateCategory');
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

describe('getAndUpdateAreaNames', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    guessAreaSpy = jest.spyOn(GuessAreaModule, 'guessArea');
  });

  it('call updateAreaNames if API successed', async () => {
    const mockGuessAreaResponse: GuessAreaModule.GuessAreaResponse = {
      areaNames: ['xxx'],
    };
    guessAreaSpy.mockResolvedValue(mockGuessAreaResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = getAndUpdateAreaNames() as any;
    await appThunk(dispatch, getState);

    expect(dispatch.mock.calls[0][0].payload).toEqual(['xxx']);
  });

  it('call updateAreaNames with undefined if position is undefined', async () => {
    const getStatewithoutPosition = () => ({
      articleForm: {},
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = getAndUpdateAreaNames() as any;
    await appThunk(dispatch, getStatewithoutPosition);

    expect(dispatch.mock.calls[0][0].payload).toBe(undefined);
  });

  it('call fetchFailure if API failed', async () => {
    getRemoteArticleSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = getAndUpdateAreaNames() as any;
    await appThunk(dispatch, getState);

    expect(dispatch.mock.calls[0][0].type).toBe('globalError/throwError');
  });
});
