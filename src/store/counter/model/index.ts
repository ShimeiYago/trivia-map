export interface CounterState {
  value: number;
  loading: boolean;
  errorMsg: string | null;
}

export const initialState: CounterState = {
  value: 0,
  loading: false,
  errorMsg: null,
};
