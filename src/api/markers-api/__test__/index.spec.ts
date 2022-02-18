import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteMarkers } from '..';

describe('getRemoteMarkers', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteMarkers();
    expect(response[0].postId).toBe('000');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getRemoteMarkers()).rejects.toEqual(expectedApiError);
  });
});
