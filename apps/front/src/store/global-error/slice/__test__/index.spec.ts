import { GlobalErrorState } from './../../model';
import { globalErrorReducer, globalErrorSlice } from '..';

const { throwError, resetErrorStatus } = globalErrorSlice.actions;

describe('auths reducer', () => {
  const initialState: GlobalErrorState = {
    status: undefined,
  };

  it('should handle initial state', () => {
    expect(globalErrorReducer(undefined, { type: 'unknown' })).toEqual({
      status: undefined,
    });
  });

  it('should handle throwError', () => {
    const actual = globalErrorReducer(initialState, throwError(404));
    expect(actual.status).toEqual(404);
  });

  it('should handle resetErrorStatus', () => {
    const actual = globalErrorReducer(initialState, resetErrorStatus());
    expect(actual.status).toEqual(undefined);
  });
});
