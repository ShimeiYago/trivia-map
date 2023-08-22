/* istanbul ignore file */

import { specialMapSettingSlice } from '../slice';
import { AppThunk } from 'store';
import { ApiError } from 'api/utils/handle-axios-error';
import { FormError } from '../model';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { updateUser } from 'store/auths/actions';
import {
  postSpecialMap,
  PostSpecialMapResponse,
  ValidationError,
} from 'api/special-map-api/post-special-map';

// basic actions
export const {
  updateSpecialMapId,
  updateTitle,
  updateDescription,
  updateIsPublic,
  updateSelectablePark,
  updateArea,
  updateLoading,
  updateThumbnail,
  updateFormError,
  refreshFormError,
  initialize,
} = specialMapSettingSlice.actions;

// submitSpecialMap action
export const submitSpecialMap = (): AppThunk => async (dispatch, getState) => {
  dispatch(updateLoading('loading'));

  const specialMapSetting = getState().specialMapSetting;

  /* istanbul ignore next */
  const refreshUser = () => dispatch(updateUser(undefined));

  let res: PostSpecialMapResponse;
  try {
    if (specialMapSetting.specialMapId) {
      res = await autoRefreshApiWrapper(
        () => {
          console.log();
        },
        // putSpecialMap({
        //   specialMapId: specialMapSetting.specialMapId
        //   title: specialMapSetting.title,
        //   description: specialMapSetting.description,
        //   thumbnail: typeof specialMapSetting.thumbnail === 'string' ? undefined : specialMapSetting.thumbnail,
        //   isPublic: specialMapSetting.isPublic,
        // selectablePark: specialMapSetting.selectablePark,
        // minLatitude: specialMapSetting.area?.minLatitude,
        // maxLatitude: specialMapSetting.area?.maxLatitude,
        // minLongitude: specialMapSetting.area?.minLongitude,
        // maxLongitude: specialMapSetting.area?.maxLongitude,

        // }),
        refreshUser,
      );
    } else {
      res = await autoRefreshApiWrapper(
        () =>
          postSpecialMap({
            title: specialMapSetting.title,
            description: specialMapSetting.description,
            thumbnail:
              typeof specialMapSetting.thumbnail === 'string' ||
              specialMapSetting.thumbnail === null
                ? undefined
                : specialMapSetting.thumbnail,
            isPublic: specialMapSetting.isPublic,
            selectablePark: specialMapSetting.selectablePark,
            minLatitude: specialMapSetting.area?.minLatitude,
            maxLatitude: specialMapSetting.area?.maxLatitude,
            minLongitude: specialMapSetting.area?.minLongitude,
            maxLongitude: specialMapSetting.area?.maxLongitude,
          }),

        refreshUser,
      );
    }
    dispatch(updateLoading('success'));
    dispatch(updateSpecialMapId(res.specialMapId));
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
    dispatch(updateLoading('error'));
  }
};
