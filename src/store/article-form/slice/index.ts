import { GetArticleResponse } from './../../../api/articles-api/index';
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

    updateContent(state, action: PayloadAction<string>) {
      state.content = action.payload;
    },

    updatePosition(state, action: PayloadAction<Position>) {
      state.position = action.payload;
    },

    submitStart(state) {
      state.submittingState = 'loading';
    },

    submitFailure(state, action: PayloadAction<FormError>) {
      state.submittingState = 'error';
      state.formError = action.payload;
    },

    submitSuccess(state, action: PayloadAction<string>) {
      state.submittingState = 'success';
      state.postId = action.payload;
    },

    fetchStart(state, action: PayloadAction<string>) {
      state.fetchingState = 'loading';
      state.postId = action.payload;
    },

    fetchFailure(state, action: PayloadAction<FormError>) {
      state.fetchingState = 'error';
      state.formError = action.payload;
    },

    fetchSuccess(state, action: PayloadAction<GetArticleResponse>) {
      state.fetchingState = 'success';
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.position = action.payload.position;
    },

    initialize(state) {
      state.postId = initialState.postId;
      state.title = initialState.title;
      state.content = initialState.content;
      state.position = initialState.position;
      state.submittingState = initialState.submittingState;
      state.fetchingState = initialState.fetchingState;
      state.formError = initialState.formError;
      state.isEditting = initialState.isEditting;
    },

    updateIsEditting(state, action: PayloadAction<boolean>) {
      state.isEditting = action.payload;
    },
  },
});

// reducer
export const articleFormReducer = articleFormSlice.reducer;
