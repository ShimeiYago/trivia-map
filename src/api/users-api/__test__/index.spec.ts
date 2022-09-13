import { ApiError } from 'api/utils/handle-axios-error';
import { getAuthorInfo } from '..';

describe('getAuthorInfo', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getAuthorInfo(1);
    expect(response.userId).toEqual(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getAuthorInfo(1)).rejects.toEqual(expectedApiError);
  });
});
