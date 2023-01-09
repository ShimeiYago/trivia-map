import { ApiError } from 'api/utils/handle-axios-error';
import { checkLikeStatus } from '../check-like-status';

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
