import { GetArticleResponse } from '../../../api/articles-api/get-remote-article';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormError, initialState } from '../model';
import { Position } from 'types/position';

export const articleFormSlice = createSlice({
  name: 'articleForm',
  initialState,
  reducers: {
    updateTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },

    updateDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },

    updatePosition(state, action: PayloadAction<Position>) {
      state.position = action.payload;
    },

    updateImageDataUrl(state, action: PayloadAction<string | null>) {
      state.imageDataUrl = action.payload;
    },

    updateIsDraft(state, action: PayloadAction<boolean>) {
      state.isDraft = action.payload;
    },

    submitStart(state) {
      state.submittingState = 'loading';
      state.formError = undefined;
    },

    submitFailure(state, action: PayloadAction<FormError>) {
      state.submittingState = 'error';
      state.formError = action.payload;
    },

    submitSuccess(state, action: PayloadAction<number>) {
      state.submittingState = 'success';
      state.postId = action.payload;
      state.isEditting = false;
    },

    fetchStart(state, action: PayloadAction<number>) {
      state.fetchingState = 'loading';
      state.postId = action.payload;
      state.formError = undefined;
    },

    fetchFailure(state, action: PayloadAction<string>) {
      state.fetchingState = 'error';
      state.fetchingErrorMsg = action.payload;
    },

    fetchSuccess(state, action: PayloadAction<GetArticleResponse>) {
      state.fetchingState = 'success';
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.position = action.payload.marker;
      state.imageDataUrl = action.payload.imageUrl;
      state.isDraft = action.payload.isDraft;
    },

    initialize(state) {
      state.postId = initialState.postId;
      state.title = initialState.title;
      state.description = initialState.description;
      state.position = initialState.position;
      state.imageDataUrl = initialState.imageDataUrl;
      state.submittingState = initialState.submittingState;
      state.fetchingState = initialState.fetchingState;
      state.formError = initialState.formError;
      state.isEditting = initialState.isEditting;
      state.fetchingErrorMsg = initialState.fetchingErrorMsg;
      state.lastSavedTitle = initialState.lastSavedTitle;
      state.lastSavedDescription = initialState.lastSavedDescription;
      state.lastSavedPosition = initialState.lastSavedPosition;
      state.lastSavedImageDataUrl = initialState.lastSavedImageDataUrl;
      state.isFormChangedFromLastSaved =
        initialState.isFormChangedFromLastSaved;
    },

    updateIsEditting(state, action: PayloadAction<boolean>) {
      state.isEditting = action.payload;
    },

    updateLastSavedValues(state) {
      state.lastSavedTitle = state.title;
      state.lastSavedDescription = state.description;
      state.lastSavedPosition = state.position;
      state.lastSavedImageDataUrl = state.imageDataUrl;
      state.isFormChangedFromLastSaved = false;
    },

    updateIsFormChangedFromLastSaved(state) {
      state.isFormChangedFromLastSaved = !(
        state.lastSavedTitle === state.title &&
        state.lastSavedDescription === state.description &&
        state.lastSavedPosition?.lat === state.position?.lat &&
        state.lastSavedPosition?.lng === state.position?.lng &&
        state.lastSavedImageDataUrl === state.imageDataUrl
      );
    },
  },
});

// reducer
export const articleFormReducer = articleFormSlice.reducer;
