import { fetchMarkers } from '..';
import * as MarkersApiModule from 'api/markers-api';
import { GetMarkersResponse } from 'api/markers-api/index';

const dispatch = jest.fn();
let getRemoteMarkersSpy: jest.SpyInstance;

const mockResponse: GetMarkersResponse = [
  {
    postId: '000',
    position: { lat: 0, lng: 0 },
    title: 'title',
  },
];

describe('fetchMarkers', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getRemoteMarkersSpy = jest.spyOn(MarkersApiModule, 'getRemoteMarkers');
  });

  it('call requestStart at first', async () => {
    getRemoteMarkersSpy.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/requestStart');
  });

  it('call fetchSuccess if API successed', async () => {
    getRemoteMarkersSpy.mockResolvedValue(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch);
    expect(dispatch.mock.calls[1][0].type).toBe('markers/fetchSuccess');
  });

  it('call requestFailure if API failed', async () => {
    getRemoteMarkersSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch);
    expect(dispatch.mock.calls[1][0].type).toBe('markers/requestFailure');
  });
});
