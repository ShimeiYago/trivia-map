import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Marker } from 'types/marker';
import { Park } from 'types/park';
import { initialState } from '../model';

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    fetchStart(state) {
      state.fetchingState = 'loading';
      state.markers = [];
      state.loadedPages = 0;
      state.totalPages = undefined;
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

    updateFocusingPark(state, action: PayloadAction<Park>) {
      state.focusingPark = action.payload;
    },

    updateFilteringCategoryId(state, action: PayloadAction<number | undefined>) {
      state.filteringCategoryId = action.payload;
    },
  },
});

// reducer
export const markersReducer = markersSlice.reducer;
