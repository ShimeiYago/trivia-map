import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../model';

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },

    decrement(state) {
      state.value -= 1;
    },

    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },

    requestStart(state) {
      state.loading = true;
      state.errorMsg = null;
    },

    requestFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.errorMsg = action.payload;
    },

    fetchSuccess(state, action: PayloadAction<number>) {
      state.loading = false;
      state.value = action.payload;
    },

    postSuccess(state) {
      state.loading = false;
    },
  },
});

// reducer
export const counterReducer = counterSlice.reducer;
