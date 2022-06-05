import {
  selectMarkersErrorMsg,
  selectMarkersFetchingState,
  selectMarkersDict,
  selectMarkersTotalRecords,
  selectMarkersLoadedRecords,
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
      totalRecords: 2,
      loadedRecords: 1,
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

  it('selectMarkersLoadedRecords should return markers totalRecords', () => {
    expect(selectMarkersLoadedRecords(rootState)).toEqual(1);
  });

  it('selectMarkersTotalRecords should return markers totalRecords', () => {
    expect(selectMarkersTotalRecords(rootState)).toEqual(2);
  });

  it('selectMarkersDeletingState should return markers deleting state', () => {
    expect(selectMarkersDeletingState(rootState)).toEqual('waiting');
  });
});
