import { ApiError } from 'api/utils/handle-axios-error';
import { getSpecialMaps } from '../get-special-maps';

describe('getspecialMaps', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getSpecialMaps({});
    expect(response.results[0].specialMapId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getSpecialMaps({})).rejects.toEqual(expectedApiError);
  });
});
