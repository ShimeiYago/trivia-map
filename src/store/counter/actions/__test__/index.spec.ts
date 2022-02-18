import { fetchCount, incrementIfOdd, postCount } from '..';
import * as CounterApiModule from 'api/counter-api';

const dispatch = jest.fn();
let getRemoteCountSpy: jest.SpyInstance;
let postRemoteCountSpy: jest.SpyInstance;

const getState = () => ({
  counter: {
    value: 0,
    loading: false,
    errorMsg: null,
  },
});

describe('fetchCount', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    getRemoteCountSpy = jest.spyOn(CounterApiModule, 'getRemoteCount');
  });

  it('call requestStart at first', async () => {
    getRemoteCountSpy.mockResolvedValue({ count: 0 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchCount() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[0][0].type).toBe('counter/requestStart');
  });

  it('call fetchSuccess if API successed', async () => {
    getRemoteCountSpy.mockResolvedValue({ count: 0 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchCount() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('counter/fetchSuccess');
  });

  it('call requestFailure if API failed', async () => {
    getRemoteCountSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = fetchCount() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('counter/requestFailure');
  });
});

describe('postCount', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    postRemoteCountSpy = jest.spyOn(CounterApiModule, 'postRemoteCount');
  });

  it('call requestStart at first', async () => {
    postRemoteCountSpy.mockResolvedValue({ count: 0 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = postCount() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[0][0].type).toBe('counter/requestStart');
  });

  it('call postSuccess if API successed', async () => {
    postRemoteCountSpy.mockResolvedValue({ count: 0 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = postCount() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('counter/postSuccess');
  });

  it('call requestFailure if API failed', async () => {
    postRemoteCountSpy.mockRejectedValue(new Error());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = postCount() as any;
    await appThunk(dispatch, getState, {});

    expect(dispatch.mock.calls[1][0].type).toBe('counter/requestFailure');
  });
});

describe('incrementIfOdd', () => {
  it('increment only if current value is odd', () => {
    const getStateOdd = () => ({
      counter: {
        value: 3, // odd
        loading: false,
        errorMsg: null,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = incrementIfOdd(3) as any;
    appThunk(dispatch, getStateOdd, {});

    expect(dispatch.mock.calls[0][0].type).toBe('counter/incrementByAmount');
  });

  it('do not increment if current value is not odd', () => {
    const getStateNotOdd = () => ({
      counter: {
        value: 2, // not odd
        loading: false,
        errorMsg: null,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appThunk = incrementIfOdd(3) as any;
    appThunk(dispatch, getStateNotOdd, {});

    expect(dispatch.mock.calls[0]).toBe(undefined);
  });
});
