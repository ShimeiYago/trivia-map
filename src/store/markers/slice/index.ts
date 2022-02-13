import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, Marker } from '../model';

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.errorMsg = null;
    },

    requestFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.errorMsg = action.payload;
    },

    fetchSuccess(state, action: PayloadAction<Marker[]>) {
      state.loading = false;
      state.list = action.payload;
    },
  },
});

// reducer
export const markersReducer = markersSlice.reducer;
