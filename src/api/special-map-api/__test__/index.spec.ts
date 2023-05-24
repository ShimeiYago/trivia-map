import { ApiError } from 'api/utils/handle-axios-error';
import { getSpecialMaps } from '../get-special-maps';
import { getSpecialMapMarkers } from '../get-special-map-markers';

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

describe('getSpecialMapMarkers', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getSpecialMapMarkers({ mapId: 1 });
    expect(response.results[0].park).toBe('L');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getSpecialMapMarkers({ mapId: 1 })).rejects.toEqual(expectedApiError);
  });
});
