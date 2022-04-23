import { selectArticleFormImageDataUrl } from './../selector/index';
import { MarkerTypeAPI } from './../../../api/markers-api/index';
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
  selectArticleFormContent,
  selectArticleFormPosition,
  selectArticleFormId,
} from '../selector';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { appendMarkers } from 'store/markers/actions';
import { Position } from 'types/position';

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
  updateIsFormChangedFromLastSaved,
  updateLastSavedValues,
  updateImageDataUrl,
} = articleFormSlice.actions;

// submitNewArticle action
export const submitNewArticle = (): AppThunk => async (dispatch, getState) => {
  dispatch(submitStart());

  const title = selectArticleFormTitle(getState());
  const content = selectArticleFormContent(getState());
  const position = selectArticleFormPosition(getState());
  const imageDataUrl = selectArticleFormImageDataUrl(getState());

  try {
    const res = await postRemoteArticle(title, content, imageDataUrl, position);
    dispatch(submitSuccess(res.postId));
    dispatch(initialize());

    const marker: MarkerTypeAPI = {
      postId: res.postId,
      position: position ?? { lat: 0, lng: 0 },
      title: title,
    };
    dispatch(appendMarkers([marker]));
  } catch (error) {
    const apiError = error as ApiError<ValidationError>;

    let formError: FormError;
    if (apiError.status === 422 && apiError.data) {
      // validation Error
      formError = {
        errorTitle: '入力内容に誤りがあります。',
        ...apiError.data,
      };
    } else {
      formError = {
        errorTitle: globalAPIErrorMessage(apiError.status, 'submit'),
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
    const imageDataUrl = selectArticleFormImageDataUrl(getState());

    if (!postId) {
      throw new Error('post ID is not setted.');
    }

    let formError: FormError;

    try {
      await putRemoteArticle(postId, title, content, imageDataUrl, position);
      dispatch(submitSuccess(postId));
      dispatch(initialize());

      const marker: MarkerTypeAPI = {
        postId: postId,
        position: position ?? { lat: 0, lng: 0 },
        title: title,
      };
      dispatch(appendMarkers([marker]));
    } catch (error) {
      const apiError = error as ApiError<ValidationError>;
      if (apiError.status === 422 && apiError.data) {
        // validation Error
        formError = {
          errorTitle: '入力内容に誤りがあります。',
          ...apiError.data,
        };
      } else {
        formError = {
          errorTitle: globalAPIErrorMessage(apiError.status, 'submit'),
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
    // have to pass case param.content=''
    if (param.content !== undefined) {
      dispatch(updateContent(param.content));
    }
    if (param.position) {
      dispatch(updatePosition(param.position));
    }
    if (param.imageDataUrl !== undefined) {
      dispatch(updateImageDataUrl(param.imageDataUrl));
    }

    dispatch(updateIsFormChangedFromLastSaved());
  };

export type UpdateFormFieldParam = {
  title?: string;
  content?: string;
  position?: Position;
  imageDataUrl?: string | null;
};
