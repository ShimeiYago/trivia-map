import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types/user';
import { initialState } from '../model';

export const authsSlice = createSlice({
  name: 'auths',
  initialState,
  reducers: {
    loginStart(state) {
      state.loggingInState = 'loading';
    },

    loginSuccess(state, action: PayloadAction<User>) {
      state.loggingInState = 'success';
      state.user = action.payload;
    },
  },
});

// reducer
export const authsReducer = authsSlice.reducer;
