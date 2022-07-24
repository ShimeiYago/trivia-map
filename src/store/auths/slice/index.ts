import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types/user';
import { initialState } from '../model';

export const authsSlice = createSlice({
  name: 'auths',
  initialState,
  reducers: {
    autoLoginStart(state) {
      state.loggingInState = 'loading';
      state.isAutoLoginTried = true;
    },

    loginSuccess(state, action: PayloadAction<User>) {
      state.loggingInState = 'success';
      state.user = action.payload;
    },

    autoLoginFailure(state) {
      state.loggingInState = 'waiting';
    },

    toggleFormModal(state, action: PayloadAction<boolean>) {
      state.openFormModal = action.payload;
    },
  },
});

// reducer
export const authsReducer = authsSlice.reducer;
