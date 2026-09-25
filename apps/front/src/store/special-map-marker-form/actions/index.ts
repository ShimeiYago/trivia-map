/* istanbul ignore file */

import { specialMapMarkerFormSlice } from '../slice';
import { AppThunk } from 'store';
import { ApiError } from 'api/utils/handle-axios-error';
import { FormError } from '../model';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { updateUser } from 'store/auths/actions';
import { putSpecialMapMarker } from 'api/special-map-api/put-special-map-marker';
import {
  postSpecialMapMarker,
  PostSpecialMapMarkerResponse,
  ValidationError,
} from 'api/special-map-api/post-special-map-marker';
import { GetSpecialMapMarkersResponse } from 'api/special-map-api/get-special-map-markers';

// basic actions
export const {
  updateSpecialMapMarkerId,
  updateDescription,
  updateImage,
  updatePosition,
  updateVariant,
  updateSubmittingState,
  updateFormError,
  refreshFormError,
  initialize,
} = specialMapMarkerFormSlice.actions;

// submitSpecialMap action
export const submitSpecialMapMarker =
  (specialMapId: number): AppThunk =>
  async (dispatch, getState) => {
    dispatch(updateSubmittingState('loading'));

    const { specialMapMarkerId, description, image, lat, lng, park, variant } =
      getState().specialMapMarkerForm;

    /* istanbul ignore next */
    const refreshUser = () => dispatch(updateUser(undefined));

    let res: PostSpecialMapMarkerResponse;
    try {
      if (specialMapMarkerId) {
        res = await autoRefreshApiWrapper(
          () =>
            putSpecialMapMarker({
              specialMapMarkerId,
              image: typeof image === 'string' ? undefined : image,
              description,
              lat,
              lng,
              park,
              variant,
            }),
          refreshUser,
        );
      } else {
        res = await autoRefreshApiWrapper(
          () =>
            postSpecialMapMarker({
              specialMapId,
              description,
              image: typeof image === 'string' || image === null ? undefined : image,
              lat,
              lng,
              park,
              variant,
            }),
          refreshUser,
        );
      }
      dispatch(updateSubmittingState('success'));
      dispatch(updateSpecialMapMarkerId(res.specialMapMarkerId));
    } catch (error) {
      const apiError = error as ApiError<ValidationError>;
      const errorTitle = globalAPIErrorMessage(apiError.status, 'submit');

      let formError: FormError;
      if (apiError.status === 400 && apiError.data) {
        // validation Error
        formError = {
          errorTitle: apiError.data.errorTitle ?? errorTitle,
          fieldErrors: apiError.data,
        };
      } else {
        formError = {
          errorTitle: errorTitle,
        };
      }
      dispatch(updateFormError(formError));
      dispatch(updateSubmittingState('error'));
    }
  };

// setSpecialMap
export const setSpecialMapMarkerForm =
  (specialMapMarker: GetSpecialMapMarkersResponse): AppThunk =>
  (dispatch) => {
    dispatch(updateSpecialMapMarkerId(specialMapMarker.specialMapMarkerId));
    dispatch(updateDescription(specialMapMarker.description));
    dispatch(updateImage(specialMapMarker.image));
    dispatch(
      updatePosition({
        lat: specialMapMarker.lat,
        lng: specialMapMarker.lng,
        park: specialMapMarker.park,
      }),
    );
    dispatch(updateVariant(specialMapMarker.variant));
    dispatch(refreshFormError());
  };
