import { readingArticleSlice } from '../slice';
import { AppThunk } from 'store';
import { ApiError } from 'api/utils/handle-axios-error';
import { getRemoteArticle } from 'api/articles-api';

// basic actions
export const { fetchStart, fetchSuccess, fetchFailure } =
  readingArticleSlice.actions;

// fetchMarkers action
export const fetchReadingArticle =
  (postId: string): AppThunk =>
  async (dispatch) => {
    dispatch(fetchStart(postId));

    try {
      const res = await getRemoteArticle(postId);
      dispatch(fetchSuccess(res));
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      dispatch(fetchFailure(apiError.errorMsg));
    }
  };
