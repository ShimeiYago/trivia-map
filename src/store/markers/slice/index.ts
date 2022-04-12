import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, MarkerDict } from '../model';

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    fetchStart(state) {
      state.fetchingState = 'loading';
      state.errorMsg = undefined;
    },

    fetchFailure(state, action: PayloadAction<string>) {
      state.fetchingState = 'error';
      state.errorMsg = action.payload;
    },

    fetchSuccess(state) {
      state.fetchingState = 'success';
    },

    updateMarkers(state, action: PayloadAction<MarkerDict>) {
      state.markers = action.payload;
    },

    updateCurrentPageToLoad(state, action: PayloadAction<number>) {
      state.currentPageToLoad = action.payload;
    },

    updateTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },

    deleteStart(state) {
      state.deletingState = 'loading';
      state.errorMsg = undefined;
    },

    deleteFailure(state, action: PayloadAction<string>) {
      state.deletingState = 'error';
      state.errorMsg = action.payload;
    },

    deleteSuccess(state) {
      state.deletingState = 'success';
    },
  },
});

// reducer
export const markersReducer = markersSlice.reducer;
