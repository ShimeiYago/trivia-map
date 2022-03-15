import { articleFormSlice } from '../slice';
import { AppThunk } from 'store';
import { ApiError } from 'api/utils/handle-axios-error';
import {
  getRemoteArticle,
  postRemoteArticle,
  putRemoteArticle,
} from 'api/articles-api';
import { FormError } from '../model';
import {
  selectArticleFormTitle,
  selectArticleFormContent,
  selectArticleFormPosition,
  selectArticleFormId,
} from '../selector';

// basic actions
export const {
  updateTitle,
  updateContent,
  updatePosition,
  submitStart,
  submitFailure,
  submitSuccess,
  fetchStart,
  fetchSuccess,
  fetchFailure,
  initialize,
  updateIsEditting,
} = articleFormSlice.actions;

// submitNewArticle action
export const submitNewArticle = (): AppThunk => async (dispatch, getState) => {
  dispatch(submitStart());

  const title = selectArticleFormTitle(getState());
  const content = selectArticleFormContent(getState());
  const position = selectArticleFormPosition(getState());

  let formError: FormError;

  try {
    const res = await postRemoteArticle(title, content, position);
    dispatch(submitSuccess(res.postId));
  } catch (error) {
    const apiError = error as ApiError<FormError>;
    if (apiError.status === 422 && apiError.data) {
      // validation Error
      formError = apiError.data;
    } else {
      formError = {
        headerErrors: [apiError.errorMsg],
      };
    }
    dispatch(submitFailure(formError));
  }
};

// submitEdittedArticle action
export const submitEdittedArticle =
  (): AppThunk => async (dispatch, getState) => {
    dispatch(submitStart());

    const postId = selectArticleFormId(getState());
    const title = selectArticleFormTitle(getState());
    const content = selectArticleFormContent(getState());
    const position = selectArticleFormPosition(getState());

    if (!postId) {
      throw new Error('post ID is not setted.');
    }

    let formError: FormError;

    try {
      const res = await putRemoteArticle(postId, title, content, position);
      dispatch(submitSuccess(res.postId));
    } catch (error) {
      const apiError = error as ApiError<FormError>;
      if (apiError.status === 422 && apiError.data) {
        // validation Error
        formError = apiError.data;
      } else {
        formError = {
          headerErrors: [apiError.errorMsg],
        };
      }
      dispatch(submitFailure(formError));
    }
  };

// fetchArticle action
export const fetchArticle =
  (postId: string): AppThunk =>
  async (dispatch) => {
    dispatch(fetchStart(postId));

    try {
      const res = await getRemoteArticle(postId);
      dispatch(fetchSuccess(res));
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      const formError: FormError = {
        headerErrors: [apiError.errorMsg],
      };
      dispatch(fetchFailure(formError));
    }
  };
