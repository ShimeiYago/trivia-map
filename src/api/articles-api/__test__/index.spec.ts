import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteArticle } from '..';

describe('getRemoteArticle', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteArticle('000');
    expect(response.title).toBe('ノーチラス号');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getRemoteArticle('000')).rejects.toEqual(expectedApiError);
  });
});
