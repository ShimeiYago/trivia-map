import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteMarkers } from '..';

describe('getRemoteMarkers', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response with page1', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteMarkers(1);
    expect(response.markers[0].postId).toBe('000');
  });

  it('handle nomal response with page2', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteMarkers(2);
    expect(response.markers[0].postId).toBe('002');
  });

  it('handle nomal response with page3', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteMarkers(3);
    expect(response.markers[0].postId).toBe('004');
  });

  it('handle nomal response with last page', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getRemoteMarkers(100);
    expect(response.nextPageIndex).toBe(null);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getRemoteMarkers(1)).rejects.toEqual(expectedApiError);
  });
});
