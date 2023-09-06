/* istanbul ignore file */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormError, initialState } from '../model';
import { SelializedImageFile } from 'types/selialized-image-file';
import { countByteLength } from 'utils/count-byte-length';
import { INPUT_FIELD_MAX_LENGTH } from 'constant';
import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';
import { MapMarkerVariant } from 'types/marker-icon';

export const specialMapMarkerFormSlice = createSlice({
  name: 'specialMapMarkerForm',
  initialState,
  reducers: {
    updateSpecialMapMarkerId(state, action: PayloadAction<number>) {
      state.specialMapMarkerId = action.payload;
    },

    updatePosition(state, action: PayloadAction<Position>) {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.park = action.payload.park;

      if (state.formError?.fieldErrors?.coordinate) {
        state.formError = {
          ...state.formError,
          fieldErrors: {
            ...state.formError.fieldErrors,
            coordinate: undefined,
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
              `文字数 ${fullWidthLength} / ${INPUT_FIELD_MAX_LENGTH.specialMapMarkerDescription}`,
            ],
          },
        };
      }
    },

    updateVariant(state, action: PayloadAction<MapMarkerVariant>) {
      state.variant = action.payload;
    },

    updateImage(state, action: PayloadAction<string | SelializedImageFile | null>) {
      state.image = action.payload;

      if (state.formError?.fieldErrors?.image) {
        state.formError = {
          ...state.formError,
          fieldErrors: {
            ...state.formError.fieldErrors,
            image: undefined,
          },
        };
      }
    },

    updateSubmittingState(state, action: PayloadAction<LoadingState>) {
      state.submittingState = action.payload;
    },

    updateFormError(state, action: PayloadAction<FormError>) {
      state.formError = action.payload;
    },

    refreshFormError(state) {
      state.formError = undefined;
    },

    initialize(state) {
      state.specialMapMarkerId = initialState.specialMapMarkerId;
      state.description = initialState.description;
      state.lat = initialState.lat;
      state.lng = initialState.lng;
      state.park = initialState.park;
      state.image = initialState.image;
      state.variant = initialState.variant;
      state.submittingState = initialState.submittingState;
      state.formError = initialState.formError;
    },
  },
});

// reducer
export const specialMapMarkerFormReducer = specialMapMarkerFormSlice.reducer;
