import { updateLoadedPages } from 'store/markers/actions';
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
} = markersSlice.actions;

describe('markers reducer', () => {
  const initialState: MarkersState = {
    markers: [],
    focusingPark: 'S',
    fetchingState: 'waiting',
    loadedPages: 0,
  };
  const loadingState: MarkersState = {
    ...initialState,
    fetchingState: 'loading',
  };

  it('should handle initial state', () => {
    expect(markersReducer(undefined, { type: 'unknown' })).toEqual({
      markers: [],
      focusingPark: 'S',
      fetchingState: 'waiting',
      loadedPages: 0,
    });
  });

  it('should handle fetchStart', () => {
    const actual = markersReducer(initialState, fetchStart());
    expect(actual.markers).toEqual([]);
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
        numberOfPublicArticles: { total: 4, breakdown: [1, 2, 1] },
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
});
