import { LatLng } from 'leaflet';
import {
  selectMarkersErrorMsg,
  selectMarkersLoading,
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
      loading: false,
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
    expect(selectMarkersLoading(rootState)).toEqual(false);
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
