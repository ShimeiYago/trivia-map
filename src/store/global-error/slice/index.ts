import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../model';

export const globalErrorSlice = createSlice({
  name: 'globalError',
  initialState,
  reducers: {
    throwError(state, action: PayloadAction<number>) {
      state.status = action.payload;
    },

    resetErrorStatus(state) {
      state.status = undefined;
    },
  },
});

// reducer
export const globalErrorReducer = globalErrorSlice.reducer;

// actions
export const { throwError, resetErrorStatus } = globalErrorSlice.actions;
