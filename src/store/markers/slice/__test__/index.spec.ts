import { MAP_MAX_COORINATE } from 'constant';
import { updateInitMapFocus, updateLoadedPages } from 'store/markers/actions';
import { Marker } from 'types/marker';
import { markersReducer, markersSlice } from '..';
import { MarkersState } from '../../model';

const {
  fetchSuccess,
  fetchStart,
  updateMarkers,
  updateTotalPages,
  updateFocusingPark,
  updateFilteringCategoryId,
  initializeFetchingState,
} = markersSlice.actions;

describe('markers reducer', () => {
  const initialState: MarkersState = {
    markers: [],
    focusingPark: 'S',
    fetchingState: 'waiting',
    loadedPages: 0,
    initMapFocus: {
      zoom: 1,
      lat: 1,
      lng: 1,
    },
  };
  const loadingState: MarkersState = {
    ...initialState,
    fetchingState: 'loading',
  };

  it('should handle initial state', () => {
    expect(markersReducer(undefined, { type: 'unknown' })).toEqual({
      markers: [],
      fetchingState: 'waiting',
      loadedPages: 0,
      initMapFocus: {
        zoom: 2,
        lat: -MAP_MAX_COORINATE / 2,
        lng: MAP_MAX_COORINATE / 2,
      },
    });
  });

  it('should handle fetchStart', () => {
    const actual = markersReducer(initialState, fetchStart());
    expect(actual.markers).toEqual([]);
  });

  it('should handle initializeFetchingState', () => {
    const actual = markersReducer(initialState, initializeFetchingState());
    expect(actual.fetchingState).toEqual('waiting');
  });

  it('should handle fetchSuccess', () => {
    const actual = markersReducer(loadingState, fetchSuccess());
    expect(actual.fetchingState).toEqual('success');
  });

  it('should handle updateMarkers', () => {
    const markers: Marker[] = [
      {
        markerId: 0,
        lat: 0,
        lng: 0,
        park: 'S',
        numberOfPublicArticles: { total: 4, eachCategory: [1, 2, 1] },
      },
    ];
    const actual = markersReducer(initialState, updateMarkers(markers));
    expect(actual.markers).toEqual(markers);
  });

  it('should handle updateTotalPages', () => {
    const actual = markersReducer(initialState, updateTotalPages(2));
    expect(actual.totalPages).toEqual(2);
  });

  it('should handle updateLoadedPages', () => {
    const actual = markersReducer(initialState, updateLoadedPages(1));
    expect(actual.loadedPages).toEqual(1);
  });

  it('should handle updateFocusingPark', () => {
    const actual = markersReducer(initialState, updateFocusingPark('L'));
    expect(actual.focusingPark).toEqual('L');
  });

  it('should handle updateFilteringCategoryId', () => {
    const actual = markersReducer(initialState, updateFilteringCategoryId(1));
    expect(actual.filteringCategoryId).toEqual(1);
  });

  it('should handle updateInitMapFocus', () => {
    const actual = markersReducer(initialState, updateInitMapFocus({ zoom: 1, lat: 1, lng: 1 }));
    expect(actual.initMapFocus).toEqual({ zoom: 1, lat: 1, lng: 1 });
  });
});
