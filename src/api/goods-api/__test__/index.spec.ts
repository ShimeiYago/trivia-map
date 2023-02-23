import { ApiError } from 'api/utils/handle-axios-error';
import { checkGoodStatus } from '../check-good-status';
import { toggleGood } from '../toggle-good';

describe('checkGoodStatus', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await checkGoodStatus(1);
    expect(response.haveAddedGood).toBe(true);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(checkGoodStatus(1)).rejects.toEqual(expectedApiError);
  });
});

describe('toggleGood', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await toggleGood(1);
    expect(response.haveAddedGood).toBe(true);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(toggleGood(1)).rejects.toEqual(expectedApiError);
  });
});
