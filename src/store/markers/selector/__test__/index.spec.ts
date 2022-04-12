import {
  selectMarkersErrorMsg,
  selectMarkersFetchingState,
  selectMarkersDict,
  selectMarkersTotalPages,
  selectMarkersCurrentPageToLoad,
  selectMarkersDeletingState,
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
      deletingState: 'waiting',
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

  it('selectMarkersFetchingState should return markers fetching state', () => {
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

  it('selectMarkersDeletingState should return markers deleting state', () => {
    expect(selectMarkersDeletingState(rootState)).toEqual('waiting');
  });
});
