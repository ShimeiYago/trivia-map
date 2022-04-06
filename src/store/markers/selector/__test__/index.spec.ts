import { LatLng } from 'leaflet';
import {
  selectMarkersErrorMsg,
  selectMarkersFetchingState,
  selectMarkerList,
  selectMarkersTotalPages,
  selectMarkersCurrentPageToLoad,
} from '..';
import { MarkersState } from '../../model';

describe('markers selector', () => {
  const rootState = {
    markers: {
      list: [
        {
          postId: '000',
          position: new LatLng(0, 0),
          title: 'title',
        },
      ],
      fetchingState: 'waiting',
      errorMsg: 'error',
      totalPages: 2,
      currentPageToLoad: 1,
    } as MarkersState,
  };

  it('selectMarkerList should return marker list', () => {
    expect(selectMarkerList(rootState)).toEqual([
      {
        postId: '000',
        position: new LatLng(0, 0),
        title: 'title',
      },
    ]);
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
