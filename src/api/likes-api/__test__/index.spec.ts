import { ApiError } from 'api/utils/handle-axios-error';
import { checkLikeStatus } from '../check-like-status';
import { getLikedArticlesPreviews } from '../get-liked-articles-previews';
import { toggleLike } from '../toggle-like';

describe('checkLikeStatus', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await checkLikeStatus(1);
    expect(response.haveLiked).toBe(true);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(checkLikeStatus(1)).rejects.toEqual(expectedApiError);
  });
});

describe('toggleLike', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await toggleLike(1);
    expect(response.haveLiked).toBe(true);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(toggleLike(1)).rejects.toEqual(expectedApiError);
  });
});

describe('getLikedArticlesPreviews', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('should return preview list without parameters', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getLikedArticlesPreviews({});
    expect(response.results[0].article.title).toBe('ノーチラス号のエンジン');
  });

  // it('should return preview list with parameters', async () => {
  //   process.env.REACT_APP_MOCK = 'normal';

  //   const response = await getLikedArticlesPreviews({
  //     page: 1,
  //     marker: 1,
  //     user: 1,
  //     park: 'L',
  //     category: 1,
  //     keywords: ['keyword1', 'keyword2'],
  //   });
  //   expect(response.results[0].title).toBe('ノーチラス号のエンジン');
  // });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getLikedArticlesPreviews({})).rejects.toEqual(expectedApiError);
  });
});
