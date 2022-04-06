import { updateCurrentPageToLoad } from 'store/markers/actions';
import { markersReducer, markersSlice } from '..';
import { Marker, MarkersState } from '../../model';

const {
  fetchSuccess,
  requestFailure,
  requestStart,
  updateList,
  updateTotalPages,
} = markersSlice.actions;

describe('markers reducer', () => {
  const initialState: MarkersState = {
    list: [],
    fetchingState: 'waiting',
    errorMsg: null,
    currentPageToLoad: 0,
  };
  const loadingState = Object.assign(initialState, { loading: true });

  it('should handle initial state', () => {
    expect(markersReducer(undefined, { type: 'unknown' })).toEqual({
      list: [],
      fetchingState: 'waiting',
      errorMsg: null,
      currentPageToLoad: 0,
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

  it('should handle updateList', () => {
    const markers: Marker[] = [
      {
        postId: '000',
        position: { lat: 0, lng: 0 },
        title: 'title',
      },
    ];
    const actual = markersReducer(loadingState, updateList(markers));
    expect(actual.list).toEqual(markers);
  });

  it('should handle updateTotalPages', () => {
    const actual = markersReducer(loadingState, updateTotalPages(2));
    expect(actual.totalPages).toEqual(2);
  });

  it('should handle updateCurrentPageToLoad', () => {
    const actual = markersReducer(loadingState, updateCurrentPageToLoad(1));
    expect(actual.currentPageToLoad).toEqual(1);
  });
});
