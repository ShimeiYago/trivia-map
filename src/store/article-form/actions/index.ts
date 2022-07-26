import { articleFormSlice } from '../slice';
import { AppThunk } from 'store';
import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteArticle } from 'api/articles-api/get-remote-article';
import {
  postRemoteArticle,
  ValidationError,
} from 'api/articles-api/post-remote-article';
import { putRemoteArticle } from 'api/articles-api/put-remote-article';
import { FormError } from '../model';
import {
  selectArticleFormTitle,
  selectArticleFormDescription,
  selectArticleFormPosition,
  selectArticleFormId,
  selectArticleFormImageDataUrl,
  selectArticleFormPreviousMarkerId,
  selectArticleFormIsDraft,
} from '../selector';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { pushMarker, deleteOneMarker } from 'store/markers/actions';
import { Position } from 'types/position';
import { Marker } from 'store/markers/model';

// basic actions
export const {
  updateTitle,
  updateDescription,
  updatePosition,
  updateIsDraft,
  submitStart,
  submitFailure,
  submitSuccess,
  fetchStart,
  fetchSuccess,
  fetchFailure,
  initialize,
  updateIsEditting,
  updateIsFormChangedFromLastSaved,
  updateLastSavedValues,
  updateImageDataUrl,
} = articleFormSlice.actions;

// submitNewArticle action
export const submitNewArticle = (): AppThunk => async (dispatch, getState) => {
  dispatch(submitStart());

  const title = selectArticleFormTitle(getState());
  const description = selectArticleFormDescription(getState());
  const position = selectArticleFormPosition(getState()) as Position;
  const imageDataUrl = selectArticleFormImageDataUrl(getState());
  const isDraft = selectArticleFormIsDraft(getState());

  try {
    const res = await postRemoteArticle(
      title,
      description,
      position,
      imageDataUrl,
      isDraft,
    );
    dispatch(submitSuccess(res.postId));
    dispatch(initialize());

    if (!isDraft) {
      const marker: Marker = {
        markerId: res.marker,
        lat: position.lat,
        lng: position.lng,
        park: position.park,
        numberOfPublicArticles: 1,
      };
      dispatch(pushMarker(marker));
    }
  } catch (error) {
    const apiError = error as ApiError<ValidationError>;

    let formError: FormError;
    const errorTitle = globalAPIErrorMessage(apiError.status, 'submit');
    if (apiError.status === 400 && apiError.data) {
      // validation Error
      formError = {
        errorTitle: errorTitle,
        ...apiError.data,
      };
    } else {
      formError = {
        errorTitle: errorTitle,
      };
    }
    dispatch(submitFailure(formError));
  }
};

// submitEdittedArticle action
export const submitEdittedArticle =
  (): AppThunk => async (dispatch, getState) => {
    dispatch(submitStart());

    const postId = selectArticleFormId(getState()) as number;
    const title = selectArticleFormTitle(getState());
    const description = selectArticleFormDescription(getState());
    const position = selectArticleFormPosition(getState()) as Position;
    const imageDataUrl = selectArticleFormImageDataUrl(getState());
    const isDraft = selectArticleFormIsDraft(getState());
    const previousMarkerId = selectArticleFormPreviousMarkerId(getState());

    let formError: FormError;

    try {
      const res = await putRemoteArticle(
        postId,
        title,
        description,
        position,
        imageDataUrl,
        isDraft,
      );
      dispatch(submitSuccess(postId));
      dispatch(initialize());

      const updatedMarker: Marker = {
        markerId: res.marker,
        lat: position.lat,
        lng: position.lng,
        park: position.park,
        numberOfPublicArticles: 1,
      };

      if (!previousMarkerId) {
        return;
      }

      dispatch(deleteOneMarker(previousMarkerId));

      if (!isDraft) {
        dispatch(pushMarker(updatedMarker));
      }
    } catch (error) {
      const apiError = error as ApiError<ValidationError>;
      const errorTitle = globalAPIErrorMessage(apiError.status, 'submit');
      if (apiError.status === 400 && apiError.data) {
        // validation Error
        formError = {
          errorTitle: errorTitle,
          ...apiError.data,
        };
      } else {
        formError = {
          errorTitle: errorTitle,
        };
      }
      dispatch(submitFailure(formError));
    }
  };

// fetchArticle action
export const fetchArticle =
  (postId: number): AppThunk =>
  async (dispatch) => {
    dispatch(fetchStart(postId));

    try {
      const res = await getRemoteArticle(postId);
      dispatch(fetchSuccess(res));
      dispatch(updateLastSavedValues());
    } catch (error) {
      const apiError = error as ApiError<unknown>;

      const errorMsg = globalAPIErrorMessage(apiError.status, 'get');
      dispatch(fetchFailure(errorMsg));
    }
  };

// updateFormField action
export const updateFormField =
  (param: UpdateFormFieldParam): AppThunk =>
  async (dispatch) => {
    // have to pass case param.title=''
    if (param.title !== undefined) {
      dispatch(updateTitle(param.title));
    }
    // have to pass case param.description=''
    if (param.description !== undefined) {
      dispatch(updateDescription(param.description));
    }
    if (param.position) {
      dispatch(updatePosition(param.position));
    }
    if (param.imageDataUrl !== undefined) {
      dispatch(updateImageDataUrl(param.imageDataUrl));
    }
    if (param.isDraft !== undefined) {
      dispatch(updateIsDraft(param.isDraft));
    }

    dispatch(updateIsFormChangedFromLastSaved());
  };

export type UpdateFormFieldParam = {
  title?: string;
  description?: string;
  position?: Position;
  imageDataUrl?: string | null;
  isDraft?: boolean;
};
