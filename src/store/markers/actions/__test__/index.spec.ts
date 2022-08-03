import { fetchMarkers, appendMarkers, pushMarker, deleteOneMarker } from '..';
import * as MarkersApiModule from 'api/markers-api';
import { mockGetMarkersResponse } from 'api/mock/markers-response';
import { Marker } from 'store/markers/model';

const dispatch = jest.fn();
let getRemoteMarkersSpy: jest.SpyInstance;

const getState = () => ({
  markers: {
    markers: [],
    loading: false,
    errorMsg: null,
  },
});

// TODO: This tests are meaningless.
describe('fetchMarkers', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getRemoteMarkersSpy = jest.spyOn(MarkersApiModule, 'getRemoteMarkers');
  });

  it('call fetchStart at first', async () => {
    getRemoteMarkersSpy.mockResolvedValue(mockGetMarkersResponse());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/fetchStart');
  });

  it('call fetchSuccess if API successed', async () => {
    getRemoteMarkersSpy.mockResolvedValue(mockGetMarkersResponse());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch);
    expect(dispatch.mock.calls.slice(-1)[0][0].type).toBe(
      'markers/fetchSuccess',
    );
  });

  it('call fetchFailure if API failed', async () => {
    getRemoteMarkersSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch, getState);
    expect(dispatch.mock.calls.slice(-1)[0][0].type).toBe(
      'globalError/throwError',
    );
  });
});

describe('appendMarkers', () => {
  it('call updateList', async () => {
    const newist: Marker[] = [
      {
        markerId: 0,
        lat: 0,
        lng: 0,
        park: 'S',
        numberOfPublicArticles: 1,
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = appendMarkers(newist) as any;
    await appThunk(dispatch, getState);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/updateMarkers');
  });
});

describe('pushMarker', () => {
  it('call updateList', async () => {
    const newMarker: Marker = {
      markerId: 0,
      lat: 0,
      lng: 0,
      park: 'S',
      numberOfPublicArticles: 1,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = pushMarker(newMarker) as any;
    await appThunk(dispatch, getState);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/updateMarkers');
  });
});

describe('pushMarker', () => {
  it('call updateList', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = deleteOneMarker(1) as any;
    await appThunk(dispatch, getState);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/updateMarkers');
  });
});
