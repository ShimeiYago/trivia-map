import { PostArticleResponse } from './../../../api/articles-api/post-remote-article';
import { SelializedImageFile } from '../../../types/selialized-image-file';
import { throwError } from 'store/global-error/slice';
import { articleFormSlice } from '../slice';
import { AppThunk } from 'store';
import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteArticle } from 'api/articles-api/get-remote-article';
import { postRemoteArticle, ValidationError } from 'api/articles-api/post-remote-article';
import { putRemoteArticle } from 'api/articles-api/put-remote-article';
import { FormError } from '../model';
import {
  selectArticleFormTitle,
  selectArticleFormDescription,
  selectArticleFormPosition,
  selectArticleFormImage,
  selectArticleFormIsDraft,
  selectArticleFormCategory,
  selectArticleFormId,
} from '../selector';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { Position } from 'types/position';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { guessArea } from 'api/guess-area';
import { fetchMarkers } from 'store/markers/actions';

// basic actions
export const {
  updateTitle,
  updateDescription,
  updatePosition,
  updateAreaNames,
  updateIsDraft,
  submitStart,
  submitFailure,
  submitSuccess,
  fetchStart,
  fetchSuccess,
  initialize,
  updateIsEditting,
  updateIsFormChangedFromLastSaved,
  updateLastSavedValues,
  updateImage,
  updateCategory,
} = articleFormSlice.actions;

// submitArticle action
export const submitArticle = (): AppThunk => async (dispatch, getState) => {
  dispatch(submitStart());

  const postId = selectArticleFormId(getState());
  const title = selectArticleFormTitle(getState());
  const description = selectArticleFormDescription(getState());
  const position = selectArticleFormPosition(getState()) as Position;
  const image = selectArticleFormImage(getState());
  const isDraft = selectArticleFormIsDraft(getState());
  const category = selectArticleFormCategory(getState());

  let res: PostArticleResponse;
  try {
    if (postId) {
      res = await autoRefreshApiWrapper(() =>
        putRemoteArticle({
          postId: postId,
          title: title,
          description: description,
          marker: position,
          image: typeof image === 'string' ? undefined : image,
          isDraft: isDraft,
          category: category,
        }),
      );
    } else {
      res = await autoRefreshApiWrapper(() =>
        postRemoteArticle({
          title: title,
          description: description,
          marker: position,
          image: typeof image === 'string' || image === null ? undefined : image,
          isDraft: isDraft,
          category: category,
        }),
      );
    }
    dispatch(submitSuccess(res.postId));
    dispatch(initialize());

    if (position.park === getState().markers.focusingPark) {
      dispatch(fetchMarkers());
    }
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
    dispatch(submitFailure(formError));
  }
};

// fetchArticle action
export const fetchArticle =
  (postId: number): AppThunk =>
  async (dispatch) => {
    dispatch(fetchStart(postId));

    try {
      const res = await autoRefreshApiWrapper(() => getRemoteArticle(postId));
      dispatch(fetchSuccess(res));
      dispatch(updateLastSavedValues());
    } catch (error) {
      const apiError = error as ApiError<unknown>;

      if (apiError.status === 404 || apiError.status === 403 || apiError.status === 401) {
        dispatch(throwError(404));
      } else {
        dispatch(throwError(500));
      }
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
      dispatch(getAndUpdateAreaNames());
    }
    if (param.image !== undefined) {
      dispatch(updateImage(param.image));
    }
    if (param.category !== undefined) {
      dispatch(updateCategory(param.category));
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
  image?: SelializedImageFile | null;
  category?: number;
  isDraft?: boolean;
};

// getAndUpdateAreaNames action
export const getAndUpdateAreaNames = (): AppThunk => async (dispatch, getState) => {
  const position = getState().articleForm.position;

  if (!position) {
    dispatch(updateAreaNames(undefined));
    return;
  }

  try {
    const res = await guessArea(position);
    dispatch(updateAreaNames(res.areaNames));
  } catch (error) {
    // nothing
  }
};
