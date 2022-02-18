import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { counterReducer } from './counter/slice';
import { markersReducer } from './markers/slice';
import { readingArticleReducer } from './reading-article/slice';

// store
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    markers: markersReducer,
    readingArticle: readingArticleReducer,
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
