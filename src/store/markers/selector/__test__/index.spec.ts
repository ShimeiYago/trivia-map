import {
  selectMarkersErrorMsg,
  selectMarkersFetchingState,
  selectMarkersDict,
  selectMarkersTotalPages,
  selectMarkersCurrentPageToLoad,
} from '..';
import { MarkersState } from '../../model';

describe('markers selector', () => {
  const rootState = {
    markers: {
      markers: {
        '000': {
          position: { lat: 0, lng: 0 },
          title: 'title',
        },
      },
      fetchingState: 'waiting',
      errorMsg: 'error',
      totalPages: 2,
      currentPageToLoad: 1,
    } as MarkersState,
  };

  it('selectMarkerList should return marker list', () => {
    expect(selectMarkersDict(rootState)).toEqual({
      '000': {
        position: { lat: 0, lng: 0 },
        title: 'title',
      },
    });
  });

  it('selectMarkersLoading should return markers loading state', () => {
    expect(selectMarkersFetchingState(rootState)).toEqual('waiting');
  });

  it('selectMarkersErrorMsg should return markers error message', () => {
    expect(selectMarkersErrorMsg(rootState)).toEqual('error');
  });

  it('selectMarkersCurrentPageToLoad should return markers totalPages', () => {
    expect(selectMarkersCurrentPageToLoad(rootState)).toEqual(1);
  });

  it('selectMarkersTotalPages should return markers totalPages', () => {
    expect(selectMarkersTotalPages(rootState)).toEqual(2);
  });
});
