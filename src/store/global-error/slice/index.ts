import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorStatus, initialState } from '../model';

export const globalErrorSlice = createSlice({
  name: 'globalError',
  initialState,
  reducers: {
    throwError(state, action: PayloadAction<ErrorStatus>) {
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
