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

    fetchSuccess(state) {
      state.loading = false;
    },

    updateList(state, action: PayloadAction<Marker[]>) {
      state.list = action.payload;
    },

    updateCurrentPageToLoad(state, action: PayloadAction<number>) {
      state.currentPageToLoad = action.payload;
    },

    updateTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
  },
});

// reducer
export const markersReducer = markersSlice.reducer;
