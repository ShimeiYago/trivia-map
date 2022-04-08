import { RootState } from 'store';

type ArticleFormRootState = Pick<RootState, 'articleForm'>;

export const selectArticleFormId = (state: ArticleFormRootState) =>
  state.articleForm.postId;

export const selectArticleFormTitle = (state: ArticleFormRootState) =>
  state.articleForm.title;

export const selectArticleFormContent = (state: ArticleFormRootState) =>
  state.articleForm.content;

export const selectArticleFormPosition = (state: ArticleFormRootState) =>
  state.articleForm.position;

export const selectArticleFormSubmittingState = (state: ArticleFormRootState) =>
  state.articleForm.submittingState;

export const selectArticleFormFetchingState = (state: ArticleFormRootState) =>
  state.articleForm.fetchingState;

export const selectArticleFormFormError = (state: ArticleFormRootState) =>
  state.articleForm.formError;

export const selectArticleFormIsEditting = (state: ArticleFormRootState) =>
  state.articleForm.isEditting;

export const selectArticleFormFetchingErrorMsg = (
  state: ArticleFormRootState,
) => state.articleForm.fetchingErrorMsg;
