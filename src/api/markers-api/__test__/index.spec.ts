import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteMarkers } from '..';

describe('getRemoteMarkers', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteMarkers();
    expect(response.results[0].markerId).toBe(0);
  });

  it('handle nomal response with page2', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteMarkers('next-url');
    expect(response.results[0].markerId).toBe(2);
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
