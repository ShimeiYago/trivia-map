import { markersReducer, markersSlice } from '..';
import { Marker, MarkersState } from '../../model';

const { fetchSuccess, requestFailure, requestStart } = markersSlice.actions;

describe('counter reducer', () => {
  const initialState: MarkersState = {
    list: [],
    loading: false,
    errorMsg: null,
  };
  const loadingState = Object.assign(initialState, { loading: true });

  it('should handle initial state', () => {
    expect(markersReducer(undefined, { type: 'unknown' })).toEqual({
      list: [],
      loading: false,
      errorMsg: null,
    });
  });
  it('should handle requestStart', () => {
    const actual = markersReducer(initialState, requestStart());
    expect(actual.loading).toEqual(true);
  });

  it('should handle requestFailure', () => {
    const actual = markersReducer(loadingState, requestFailure('error'));
    expect(actual.loading).toEqual(false);
    expect(actual.errorMsg).toEqual('error');
  });

  it('should handle fetchSuccess', () => {
    const markers: Marker[] = [
      {
        postId: '000',
        position: { lat: 0, lng: 0 },
        title: 'title',
      },
    ];
    const actual = markersReducer(loadingState, fetchSuccess(markers));
    expect(actual.loading).toEqual(false);
    expect(actual.list).toEqual(markers);
  });
});
