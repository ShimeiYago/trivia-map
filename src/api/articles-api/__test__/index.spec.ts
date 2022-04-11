import { Position } from 'types/position';
import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteArticle } from '../get-remote-article';
import { postRemoteArticle } from '../post-remote-article';
import { putRemoteArticle } from '../put-remote-article';
import { deleteRemoteArticle } from '../delete-remote-article';

const newPosition: Position = { lat: 0, lng: 0 };

describe('getRemoteArticle', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteArticle('000');
    expect(response.title).toBe('ノーチラス号');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getRemoteArticle('000')).rejects.toEqual(expectedApiError);
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

    const response = await postRemoteArticle('title', 'content', newPosition);
    expect(response.postId).toBe('100');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(
      postRemoteArticle('title', 'content', newPosition),
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

    const response = await putRemoteArticle(
      '100',
      'title',
      'content',
      newPosition,
    );
    expect(response.postId).toBe('100');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(
      putRemoteArticle('100', 'title', 'content', newPosition),
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

    const response = await deleteRemoteArticle('100');
    expect(response.postId).toBe('100');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(deleteRemoteArticle('000')).rejects.toEqual(expectedApiError);
  });
});
