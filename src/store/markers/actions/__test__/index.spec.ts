import {
  fetchMarkers,
  appendMarkers,
  removeMarkerInDict,
  deleteArticle,
} from '..';
import * as MarkersApiModule from 'api/markers-api';
import * as DeleteArticlesApiModule from 'api/articles-api/delete-remote-article';
import { mockGetMarkersResponse } from 'api/mock/markers-response';

const deleteMockResponse = {
  postId: '000',
};

const dispatch = jest.fn();
let getRemoteMarkersSpy: jest.SpyInstance;
let deleteRemoteArticleSpy: jest.SpyInstance;

const getState = () => ({
  markers: {
    markers: {},
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
      'markers/fetchFailure',
    );
  });
});

describe('appendMarkers', () => {
  it('call updateList', async () => {
    const newist = [
      {
        postId: '000',
        title: 'title',
        position: { lat: 0, lng: 0 },
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = appendMarkers(newist) as any;
    await appThunk(dispatch, getState);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/updateMarkers');
  });
});

describe('deleteMarkerInDict', () => {
  const getStateWithMarkerData = () => ({
    markers: {
      markers: {
        '000': {
          title: 'title',
          position: { lat: 0, lng: 0 },
        },
      },
      loading: false,
      errorMsg: null,
    },
  });

  it('call updateMarkers', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = removeMarkerInDict('000') as any;
    await appThunk(dispatch, getStateWithMarkerData);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/updateMarkers');
  });
});

describe('deleteArticle', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    deleteRemoteArticleSpy = jest.spyOn(
      DeleteArticlesApiModule,
      'deleteRemoteArticle',
    );
  });

  it('call deleteSuccess if API successed', async () => {
    deleteRemoteArticleSpy.mockResolvedValue(deleteMockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = deleteArticle('000') as any;
    await appThunk(dispatch);
    expect(dispatch.mock.calls[2][0].type).toBe('markers/deleteSuccess');
  });

  it('call fetchFailure if API failed', async () => {
    deleteRemoteArticleSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = deleteArticle('000') as any;
    await appThunk(dispatch, getState);
    expect(dispatch.mock.calls[1][0].type).toBe('markers/deleteFailure');
  });
});
