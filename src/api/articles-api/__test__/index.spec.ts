import { Position } from 'types/position';
import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteArticle } from '../get-remote-article';
import { postRemoteArticle } from '../post-remote-article';
import { putRemoteArticle } from '../put-remote-article';
import { deleteRemoteArticle } from '../delete-remote-article';
import { getArticlesPreviews } from '../get-articles-previews';
import { getMyArticles } from '../get-my-articles';
import { patchRemoteArticle } from '../patch-remote-article';

const newPosition: Position = {
  lat: 0,
  lng: 0,
  park: 'S',
};

describe('getRemoteArticle', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteArticle(1);
    expect(response.title).toBe('ノーチラス号');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getRemoteArticle(1)).rejects.toEqual(expectedApiError);
  });
});

describe('postRemoteArticle', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await postRemoteArticle({
      title: 'title',
      description: 'description',
      marker: newPosition,
      isDraft: false,
      category: 1,
    });
    expect(response.postId).toBe(1);
  });

  it('handle image', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await postRemoteArticle({
      title: 'title',
      description: 'description',
      marker: newPosition,
      isDraft: false,
      category: 1,
      image: {
        dataUrl: 'data:image/png;base64,xxx',
        fileName: 'filename',
      },
    });
    expect(response.postId).toBe(1);
  });

  it('handle draft', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await postRemoteArticle({
      title: 'title',
      description: 'description',
      marker: newPosition,
      isDraft: true,
      category: 1,
    });
    expect(response.postId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(
      postRemoteArticle({
        title: 'title',
        description: 'description',
        marker: newPosition,
        isDraft: false,
        category: 1,
      }),
    ).rejects.toEqual(expectedApiError);
  });
});

describe('putRemoteArticle', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await putRemoteArticle({
      postId: 1,
      title: 'title',
      description: 'description',
      marker: newPosition,
      isDraft: false,
      category: 1,
    });
    expect(response.postId).toBe(1);
  });

  it('handle image', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await putRemoteArticle({
      postId: 1,
      title: 'title',
      description: 'description',
      marker: newPosition,
      isDraft: false,
      category: 1,
      image: {
        dataUrl: 'data:image/png;base64,xxx',
        fileName: 'filename',
      },
    });
    expect(response.postId).toBe(1);
  });

  it('handle null image', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await putRemoteArticle({
      postId: 1,
      title: 'title',
      description: 'description',
      marker: newPosition,
      isDraft: false,
      category: 1,
      image: null,
    });
    expect(response.postId).toBe(1);
  });

  it('handle draft response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await putRemoteArticle({
      postId: 1,
      title: 'title',
      description: 'description',
      marker: newPosition,
      isDraft: true,
      category: 1,
    });
    expect(response.postId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(
      putRemoteArticle({
        postId: 1,
        title: 'title',
        description: 'description',
        marker: newPosition,
        isDraft: false,
        category: 1,
      }),
    ).rejects.toEqual(expectedApiError);
  });
});

describe('patchRemoteArticle', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await patchRemoteArticle({
      postId: 1,
      title: 'title',
      description: 'description',
      isDraft: false,
      category: 1,
    });
    expect(response.postId).toBe(1);
  });

  it('handle image', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await patchRemoteArticle({
      postId: 1,
      title: 'title',
      description: 'description',
      isDraft: false,
      category: 1,
      image: {
        dataUrl: 'data:image/png;base64,xxx',
        fileName: 'filename',
      },
    });
    expect(response.postId).toBe(1);
  });

  it('handle null image', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await patchRemoteArticle({
      postId: 1,
      title: 'title',
      description: 'description',
      isDraft: false,
      category: 1,
      image: null,
    });
    expect(response.postId).toBe(1);
  });

  it('handle draft response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await patchRemoteArticle({
      postId: 1,
      title: 'title',
      description: 'description',
      isDraft: true,
      category: 1,
    });
    expect(response.postId).toBe(1);
  });

  it('handle empty request', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await patchRemoteArticle({
      postId: 1,
    });
    expect(response.postId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(
      patchRemoteArticle({
        postId: 1,
        title: 'title',
        description: 'description',
        isDraft: false,
        category: 1,
      }),
    ).rejects.toEqual(expectedApiError);
  });
});

describe('deleteRemoteArticle', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await deleteRemoteArticle(100);
    expect(response).toEqual({});
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(deleteRemoteArticle(100)).rejects.toEqual(expectedApiError);
  });
});

describe('getArticlesPreviews', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('should return preview list without parameters', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getArticlesPreviews({});
    expect(response.results[0].title).toBe('ノーチラス号のエンジン');
  });

  it('should return preview list with parameters', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getArticlesPreviews({
      page: 1,
      marker: 1,
      user: 1,
      park: 'L',
      category: 1,
      keywords: ['keyword1', 'keyword2'],
    });
    expect(response.results[0].title).toBe('ノーチラス号のエンジン');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getArticlesPreviews({})).rejects.toEqual(expectedApiError);
  });
});

describe('getMyArticles', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('should return preview list', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getMyArticles({});
    expect(response.results[0].title).toBe('ノーチラス号のエンジン');
  });

  it('should return preview list with page param', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getMyArticles({ page: 1 });
    expect(response.results[0].title).toBe('ノーチラス号のエンジン');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getMyArticles({})).rejects.toEqual(expectedApiError);
  });
});
