import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../model';
import { GetArticleResponse } from 'api/articles-api/get-remote-article';

export const readingArticleSlice = createSlice({
  name: 'readingArticle',
  initialState,
  reducers: {
    fetchStart(state, action: PayloadAction<string>) {
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
      state.content = action.payload.content;
      state.imageUrl = action.payload.imageDataUrl;
      state.position = action.payload.position;
    },
  },
});

// reducer
export const readingArticleReducer = readingArticleSlice.reducer;
