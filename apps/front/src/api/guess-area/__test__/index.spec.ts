import { ApiError } from 'api/utils/handle-axios-error';
import { guessArea } from '..';

describe('getRemoteMarkers', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await guessArea({ lat: 1, lng: 1, park: 'L' });
    expect(response.areaNames).toEqual([
      'シー',
      'メディテレーニアンハーバー',
      'ポルトパラディーゾ',
    ]);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(guessArea({ lat: 1, lng: 1, park: 'L' })).rejects.toEqual(expectedApiError);
  });
});
