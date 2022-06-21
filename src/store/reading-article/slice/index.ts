import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../model';
import { GetArticleResponse } from 'api/articles-api/get-remote-article';

export const readingArticleSlice = createSlice({
  name: 'readingArticle',
  initialState,
  reducers: {
    fetchStart(state, action: PayloadAction<number>) {
      state.loadingState = 'loading';
      state.postId = action.payload;
    },

    fetchFailure(state, action: PayloadAction<string>) {
      state.loadingState = 'error';
      state.errorMsg = action.payload;
    },

    fetchSuccess(state, action: PayloadAction<GetArticleResponse>) {
      state.loadingState = 'success';
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.imageUrl = action.payload.imageUrl;
      state.position = action.payload.marker;
      state.author = action.payload.author;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
    },
  },
});

// reducer
export const readingArticleReducer = readingArticleSlice.reducer;
