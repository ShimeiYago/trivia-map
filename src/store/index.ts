import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { markersReducer } from './markers/slice';
import { articleFormReducer } from './article-form/slice';
import { authsReducer } from './auths/slice/index';
import { globalErrorReducer } from './global-error/slice';
import { specialMapSettingReducer } from './special-map-setting/slice';
import { specialMapMarkerFormReducer } from './special-map-marker-form/slice';

// store
export const store = configureStore({
  reducer: {
    markers: markersReducer,
    articleForm: articleFormReducer,
    auths: authsReducer,
    globalError: globalErrorReducer,
    specialMapSetting: specialMapSettingReducer,
    specialMapMarkerForm: specialMapMarkerFormReducer,
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
