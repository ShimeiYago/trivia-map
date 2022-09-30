import {
  selectMarkersFetchingState,
  selectMarkersTotalPages,
  selectMarkersLoadedPages,
  selectFocusingPark,
  selectFilteringCategoryId,
  selectMarkers,
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
      focusingPark: 'S',
      filteringCategoryId: 1,
      fetchingState: 'waiting',
      errorMsg: 'error',
      totalPages: 2,
      loadedPages: 1,
    } as MarkersState,
  };

  it('selectMarkers should return sea marker list', () => {
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

  it('selectMarkersLoadedPages should return markers totalPages', () => {
    expect(selectMarkersLoadedPages(rootState)).toEqual(1);
  });

  it('selectMarkersTotalPages should return markers totalPages', () => {
    expect(selectMarkersTotalPages(rootState)).toEqual(2);
  });

  it('selectFocusingPark should return markers focusingPark', () => {
    expect(selectFocusingPark(rootState)).toEqual('S');
  });

  it('selectFilteringCategoryId should return markers filteringCategoryId', () => {
    expect(selectFilteringCategoryId(rootState)).toEqual(1);
  });
});
