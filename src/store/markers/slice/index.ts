import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, MarkerDict } from '../model';

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    requestStart(state) {
      state.fetchingState = 'loading';
      state.errorMsg = undefined;
    },

    requestFailure(state, action: PayloadAction<string>) {
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
  },
});

// reducer
export const markersReducer = markersSlice.reducer;
