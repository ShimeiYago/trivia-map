import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { markersReducer } from './markers/slice';
import { readingArticleReducer } from './reading-article/slice';
import { articleFormReducer } from './article-form/slice';

// store
export const store = configureStore({
  reducer: {
    markers: markersReducer,
    readingArticle: readingArticleReducer,
    articleForm: articleFormReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
