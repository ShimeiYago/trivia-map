import { MarkerDict } from './../../model/index';
import { updateLoadedRecords } from 'store/markers/actions';
import { markersReducer, markersSlice } from '..';
import { MarkersState } from '../../model';

const {
  fetchSuccess,
  fetchFailure,
  fetchStart,
  updateMarkers,
  updateTotalRecords,
  deleteStart,
  deleteFailure,
  deleteSuccess,
} = markersSlice.actions;

describe('markers reducer', () => {
  const initialState: MarkersState = {
    markers: {},
    fetchingState: 'waiting',
    loadedRecords: 0,
    deletingState: 'waiting',
  };
  const loadingState = Object.assign(initialState, { loading: true });

  it('should handle initial state', () => {
    expect(markersReducer(undefined, { type: 'unknown' })).toEqual({
      markers: {},
      fetchingState: 'waiting',
      loadedRecords: 0,
      deletingState: 'waiting',
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
    const markers: MarkerDict = {
      '000': {
        position: { lat: 0, lng: 0 },
        title: 'title',
      },
    };
    const actual = markersReducer(loadingState, updateMarkers(markers));
    expect(actual.markers).toEqual(markers);
  });

  it('should handle updateTotalRecords', () => {
    const actual = markersReducer(loadingState, updateTotalRecords(2));
    expect(actual.totalRecords).toEqual(2);
  });

  it('should handle updateLoadedRecords', () => {
    const actual = markersReducer(loadingState, updateLoadedRecords(1));
    expect(actual.loadedRecords).toEqual(1);
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
