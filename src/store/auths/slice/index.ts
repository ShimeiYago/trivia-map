import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types/user';
import { initialState } from '../model';

export const authsSlice = createSlice({
  name: 'auths',
  initialState,
  reducers: {
    autoLoginStart(state) {
      state.autoLoggingInState = 'loading';
    },

    loginSuccess(state, action: PayloadAction<User>) {
      state.autoLoggingInState = 'success';
      state.user = action.payload;
    },

    updateUser(state, action: PayloadAction<User | undefined>) {
      state.user = action.payload;
    },

    autoLoginFailure(state) {
      state.autoLoggingInState = 'error';
    },

    toggleFormModal(state, action: PayloadAction<boolean>) {
      state.openFormModal = action.payload;
    },

    logoutStart(state) {
      state.loggedOutSuccessfully = false;
    },

    logoutSuccess(state) {
      state.user = undefined;
      state.autoLoggingInState = 'error';
      state.loggedOutSuccessfully = true;
    },
  },
});

// reducer
export const authsReducer = authsSlice.reducer;
