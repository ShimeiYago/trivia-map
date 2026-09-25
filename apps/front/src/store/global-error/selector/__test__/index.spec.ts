import { selectGlobalErrorStatus } from '..';
import { GlobalErrorState } from '../../model';

describe('globalError selector', () => {
  const rootState = {
    globalError: {
      status: 404,
    } as GlobalErrorState,
  };

  it('selectGlobalErrorStatus should return error status', () => {
    expect(selectGlobalErrorStatus(rootState)).toEqual(404);
  });
});
