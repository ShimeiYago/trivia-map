/* istanbul ignore file */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormError, initialState } from '../model';
import { SelializedImageFile } from 'types/selialized-image-file';
import { countByteLength } from 'utils/count-byte-length';
import { INPUT_FIELD_MAX_LENGTH } from 'constant';
import { Area } from 'types/area';
import { SelectablePark } from 'types/park';
import { LoadingState } from 'types/loading-state';

export const specialMapSettingSlice = createSlice({
  name: 'specialMapSetting',
  initialState,
  reducers: {
    updateSpecialMapId(state, action: PayloadAction<number>) {
      state.specialMapId = action.payload;
    },

    updateTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;

      if (state.formError?.fieldErrors?.title) {
        state.formError = {
          ...state.formError,
          fieldErrors: {
            ...state.formError.fieldErrors,
            title: undefined,
          },
        };
      }
    },

    updateDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;

      if (state.formError?.fieldErrors?.description) {
        state.formError = {
          ...state.formError,
          fieldErrors: {
            ...state.formError.fieldErrors,
            description: undefined,
          },
        };
      }

      const byteLength = countByteLength(action.payload, 2);
      const fullWidthLength = Math.ceil(byteLength / 2);
      if (byteLength > INPUT_FIELD_MAX_LENGTH.specialMapDescription * 2) {
        state.formError = {
          ...state.formError,
          fieldErrors: {
            ...state.formError?.fieldErrors,
            description: [
              `文字数 ${fullWidthLength} / ${INPUT_FIELD_MAX_LENGTH.specialMapDescription}`,
            ],
          },
        };
      }
    },

    updateIsPublic(state, action: PayloadAction<boolean>) {
      state.isPublic = action.payload;
    },

    updateSelectablePark(state, action: PayloadAction<SelectablePark>) {
      state.selectablePark = action.payload;

      if (state.formError?.fieldErrors?.selectablePark) {
        state.formError = {
          ...state.formError,
          fieldErrors: {
            ...state.formError.fieldErrors,
            selectablePark: undefined,
          },
        };
      }
    },

    updateArea(state, action: PayloadAction<Area>) {
      state.area = action.payload;

      if (state.formError?.fieldErrors?.area) {
        state.formError = {
          ...state.formError,
          fieldErrors: {
            ...state.formError.fieldErrors,
            area: undefined,
          },
        };
      }
    },

    updateThumbnail(state, action: PayloadAction<string | SelializedImageFile | null>) {
      state.thumbnail = action.payload;

      if (state.formError?.fieldErrors?.thumbnail) {
        state.formError = {
          ...state.formError,
          fieldErrors: {
            ...state.formError.fieldErrors,
            thumbnail: undefined,
          },
        };
      }
    },

    updateLoading(state, action: PayloadAction<LoadingState>) {
      state.loading = action.payload;
    },

    updateFormError(state, action: PayloadAction<FormError>) {
      state.formError = action.payload;
    },

    refreshFormError(state) {
      state.formError = undefined;
    },

    initialize(state) {
      state.specialMapId = initialState.specialMapId;
      state.title = initialState.title;
      state.description = initialState.description;
      state.isPublic = initialState.isPublic;
      state.selectablePark = initialState.selectablePark;
      state.thumbnail = initialState.thumbnail;
      state.area = initialState.area;
      state.loading = initialState.loading;
      state.area = initialState.area;
      state.formError = initialState.formError;
    },
  },
});

// reducer
export const specialMapSettingReducer = specialMapSettingSlice.reducer;
