import { GetArticleResponse } from '../../../api/articles-api/get-remote-article';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormError, initialState } from '../model';
import { Position } from 'types/position';
import { SelializedImageFile } from 'types/SelializedImageFile';

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

    updateImage(
      state,
      action: PayloadAction<string | SelializedImageFile | null>,
    ) {
      state.image = action.payload;
    },

    updateCategory(state, action: PayloadAction<number>) {
      state.category = action.payload;
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

    fetchSuccess(state, action: PayloadAction<GetArticleResponse>) {
      state.fetchingState = 'success';
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.position = action.payload.marker;
      state.areaNames = action.payload.marker.areaNames;
      state.image = action.payload.image;
      state.category = action.payload.category;
      state.isDraft = action.payload.isDraft;
    },

    initialize(state) {
      state.postId = initialState.postId;
      state.title = initialState.title;
      state.description = initialState.description;
      state.position = initialState.position;
      state.areaNames = initialState.areaNames;
      state.image = initialState.image;
      state.category = initialState.category;
      state.submittingState = initialState.submittingState;
      state.fetchingState = initialState.fetchingState;
      state.formError = initialState.formError;
      state.isEditting = initialState.isEditting;
      state.lastSavedTitle = initialState.lastSavedTitle;
      state.lastSavedDescription = initialState.lastSavedDescription;
      state.lastSavedPosition = initialState.lastSavedPosition;
      state.lastSavedImage = initialState.lastSavedImage;
      state.lastSavedCategory = initialState.lastSavedCategory;
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
      state.lastSavedImage = state.image;
      state.lastSavedCategory = state.category;
      state.isFormChangedFromLastSaved = false;
    },

    updateIsFormChangedFromLastSaved(state) {
      state.isFormChangedFromLastSaved = !(
        state.lastSavedTitle === state.title &&
        state.lastSavedDescription === state.description &&
        state.lastSavedPosition?.lat === state.position?.lat &&
        state.lastSavedPosition?.lng === state.position?.lng &&
        state.lastSavedImage === state.image &&
        state.lastSavedCategory === state.category
      );
    },
  },
});

// reducer
export const articleFormReducer = articleFormSlice.reducer;
