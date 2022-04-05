import { fetchMarkers, appendMarkers } from '..';
import * as MarkersApiModule from 'api/markers-api';
import { GetMarkersResponse } from 'api/markers-api/index';

class MockResponseForPagiNation {
  private currentPage: number;
  constructor() {
    this.currentPage = 1;
  }

  getMockResponse(): GetMarkersResponse {
    if (this.currentPage === 1) {
      this.currentPage += 1;
      return this.mockResponsePage1;
    } else {
      this.currentPage += 1;
      return this.mockResponsePage2;
    }
  }

  protected mockResponsePage1: GetMarkersResponse = {
    totalPage: 2,
    nextPageIndex: 2,
    markers: [
      {
        postId: '000',
        position: { lat: 0, lng: 0 },
        title: 'title',
      },
    ],
  };

  protected mockResponsePage2: GetMarkersResponse = {
    totalPage: 2,
    nextPageIndex: null,
    markers: [
      {
        postId: '001',
        position: { lat: 0, lng: 0 },
        title: 'title',
      },
    ],
  };
}

const dispatch = jest.fn();
let getRemoteMarkersSpy: jest.SpyInstance;
let mockResponseForPagiNation: MockResponseForPagiNation;

const getState = () => ({
  markers: {
    list: [],
    loading: false,
    errorMsg: null,
  },
});

describe('fetchMarkers', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getRemoteMarkersSpy = jest.spyOn(MarkersApiModule, 'getRemoteMarkers');
    mockResponseForPagiNation = new MockResponseForPagiNation();
  });

  it('call requestStart at first', async () => {
    getRemoteMarkersSpy.mockResolvedValue(
      mockResponseForPagiNation.getMockResponse(),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/requestStart');
  });

  it('call fetchSuccess if API successed', async () => {
    getRemoteMarkersSpy.mockResolvedValue(
      mockResponseForPagiNation.getMockResponse(),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch);
    // console.log(dispatch.mock);
    expect(dispatch.mock.calls[4][0].type).toBe('markers/fetchSuccess');
  });

  it('call requestFailure if API failed', async () => {
    getRemoteMarkersSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchMarkers() as any;
    await appThunk(dispatch, getState);
    expect(dispatch.mock.calls[1][0].type).toBe('markers/requestFailure');
  });
});

describe('appendMarkers', () => {
  it('call updateList', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = appendMarkers([]) as any;
    await appThunk(dispatch, getState);
    expect(dispatch.mock.calls[0][0].type).toBe('markers/updateList');
  });
});
