import { MarkerDict } from './../../model/index';
import { updateCurrentPageToLoad } from 'store/markers/actions';
import { markersReducer, markersSlice } from '..';
import { MarkersState } from '../../model';

const {
  fetchSuccess,
  requestFailure,
  requestStart,
  updateMarkers,
  updateTotalPages,
  deleteStart,
  deleteFailure,
  deleteSuccess,
} = markersSlice.actions;

describe('markers reducer', () => {
  const initialState: MarkersState = {
    markers: {},
    fetchingState: 'waiting',
    currentPageToLoad: 0,
    deletingState: 'waiting',
  };
  const loadingState = Object.assign(initialState, { loading: true });

  it('should handle initial state', () => {
    expect(markersReducer(undefined, { type: 'unknown' })).toEqual({
      markers: {},
      fetchingState: 'waiting',
      currentPageToLoad: 0,
      deletingState: 'waiting',
    });
  });
  it('should handle requestStart', () => {
    const actual = markersReducer(initialState, requestStart());
    expect(actual.fetchingState).toEqual('loading');
  });

  it('should handle requestFailure', () => {
    const actual = markersReducer(loadingState, requestFailure('error'));
    expect(actual.fetchingState).toEqual('error');
    expect(actual.errorMsg).toEqual('error');
  });

  it('should handle fetchSuccess', () => {
    const actual = markersReducer(loadingState, fetchSuccess());
    expect(actual.fetchingState).toEqual('success');
  });

  it('should handle updateMarkers', () => {
    const markers: MarkerDict = {
      '000': {
        position: { lat: 0, lng: 0 },
        title: 'title',
      },
    };
    const actual = markersReducer(loadingState, updateMarkers(markers));
    expect(actual.markers).toEqual(markers);
  });

  it('should handle updateTotalPages', () => {
    const actual = markersReducer(loadingState, updateTotalPages(2));
    expect(actual.totalPages).toEqual(2);
  });

  it('should handle updateCurrentPageToLoad', () => {
    const actual = markersReducer(loadingState, updateCurrentPageToLoad(1));
    expect(actual.currentPageToLoad).toEqual(1);
  });

  it('should handle deleteStart', () => {
    const actual = markersReducer(initialState, deleteStart());
    expect(actual.deletingState).toEqual('loading');
  });

  it('should handle deleteFailure', () => {
    const actual = markersReducer(loadingState, deleteFailure('error'));
    expect(actual.deletingState).toEqual('error');
    expect(actual.errorMsg).toEqual('error');
  });

  it('should handle deleteSuccess', () => {
    const actual = markersReducer(loadingState, deleteSuccess());
    expect(actual.deletingState).toEqual('success');
  });
});
