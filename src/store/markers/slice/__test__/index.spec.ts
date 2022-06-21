import { Marker } from './../../model/index';
import { updateLoadedPages } from 'store/markers/actions';
import { markersReducer, markersSlice } from '..';
import { MarkersState } from '../../model';

const {
  fetchSuccess,
  fetchFailure,
  fetchStart,
  updateMarkers,
  updateTotalPages,
} = markersSlice.actions;

describe('markers reducer', () => {
  const initialState: MarkersState = {
    markers: [],
    fetchingState: 'waiting',
    loadedPages: 0,
  };
  const loadingState = Object.assign(initialState, { loading: true });

  it('should handle initial state', () => {
    expect(markersReducer(undefined, { type: 'unknown' })).toEqual({
      markers: [],
      fetchingState: 'waiting',
      loadedPages: 0,
    });
  });
  it('should handle fetchStart', () => {
    const actual = markersReducer(initialState, fetchStart());
    expect(actual.fetchingState).toEqual('loading');
  });

  it('should handle fetchFailure', () => {
    const actual = markersReducer(loadingState, fetchFailure('error'));
    expect(actual.fetchingState).toEqual('error');
    expect(actual.errorMsg).toEqual('error');
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
        numberOfPublicArticles: 1,
      },
    ];
    const actual = markersReducer(loadingState, updateMarkers(markers));
    expect(actual.markers).toEqual(markers);
  });

  it('should handle updateTotalPages', () => {
    const actual = markersReducer(loadingState, updateTotalPages(2));
    expect(actual.totalPages).toEqual(2);
  });

  it('should handle updateLoadedPages', () => {
    const actual = markersReducer(loadingState, updateLoadedPages(1));
    expect(actual.loadedPages).toEqual(1);
  });
});
