import {
  selectMarkersErrorMsg,
  selectMarkersFetchingState,
  selectMarkers,
  selectMarkersTotalPages,
  selectMarkersLoadedPages,
} from '..';
import { MarkersState } from '../../model';

describe('markers selector', () => {
  const rootState = {
    markers: {
      markers: [
        {
          markerId: 1,
          lat: 0,
          lng: 0,
          park: 'S',
          numberOfPublicArticles: 1,
        },
      ],
      fetchingState: 'waiting',
      errorMsg: 'error',
      totalPages: 2,
      loadedPages: 1,
    } as MarkersState,
  };

  it('selectMarkerList should return marker list', () => {
    expect(selectMarkers(rootState)).toEqual([
      {
        markerId: 1,
        lat: 0,
        lng: 0,
        park: 'S',
        numberOfPublicArticles: 1,
      },
    ]);
  });

  it('selectMarkersFetchingState should return markers fetching state', () => {
    expect(selectMarkersFetchingState(rootState)).toEqual('waiting');
  });

  it('selectMarkersErrorMsg should return markers error message', () => {
    expect(selectMarkersErrorMsg(rootState)).toEqual('error');
  });

  it('selectMarkersLoadedPages should return markers totalPages', () => {
    expect(selectMarkersLoadedPages(rootState)).toEqual(1);
  });

  it('selectMarkersTotalPages should return markers totalPages', () => {
    expect(selectMarkersTotalPages(rootState)).toEqual(2);
  });
});
