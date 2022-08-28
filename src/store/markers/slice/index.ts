import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, Marker } from '../model';

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    fetchStart(state) {
      state.fetchingState = 'loading';
      state.markers = [];
    },

    fetchSuccess(state) {
      state.fetchingState = 'success';
    },

    updateMarkers(state, action: PayloadAction<Marker[]>) {
      state.markers = action.payload;
    },

    updateLoadedPages(state, action: PayloadAction<number>) {
      state.loadedPages = action.payload;
    },

    updateTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
  },
});

// reducer
export const markersReducer = markersSlice.reducer;
