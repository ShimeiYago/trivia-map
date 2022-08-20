import { RootState } from 'store';

type ArticleFormRootState = Pick<RootState, 'articleForm'>;

export const selectArticleFormId = (state: ArticleFormRootState) =>
  state.articleForm.postId;

export const selectArticleFormTitle = (state: ArticleFormRootState) =>
  state.articleForm.title;

export const selectArticleFormDescription = (state: ArticleFormRootState) =>
  state.articleForm.description;

export const selectArticleFormPosition = (state: ArticleFormRootState) =>
  state.articleForm.position;

export const selectArticleFormImage = (state: ArticleFormRootState) =>
  state.articleForm.image;

export const selectArticleFormCategory = (state: ArticleFormRootState) =>
  state.articleForm.category;

export const selectArticleFormSubmittingState = (state: ArticleFormRootState) =>
  state.articleForm.submittingState;

export const selectArticleFormFetchingState = (state: ArticleFormRootState) =>
  state.articleForm.fetchingState;

export const selectArticleFormFormError = (state: ArticleFormRootState) =>
  state.articleForm.formError;

export const selectArticleFormIsEditting = (state: ArticleFormRootState) =>
  state.articleForm.isEditting;

export const selectArticleFormLastSavedTitle = (state: ArticleFormRootState) =>
  state.articleForm.lastSavedTitle;

export const selectArticleFormLastSavedDescription = (
  state: ArticleFormRootState,
) => state.articleForm.lastSavedDescription;

export const selectArticleFormLastSavedPosition = (
  state: ArticleFormRootState,
) => state.articleForm.lastSavedPosition;

export const selectArticleFormLastSavedImage = (state: ArticleFormRootState) =>
  state.articleForm.lastSavedImage;

export const selectArticleFormLastSavedCategory = (
  state: ArticleFormRootState,
) => state.articleForm.lastSavedCategory;

export const selectArticleFormIsFormChangedFromLastSaved = (
  state: ArticleFormRootState,
) => state.articleForm.isFormChangedFromLastSaved;

export const selectArticleFormPreviousMarkerId = (
  state: ArticleFormRootState,
) => state.articleForm.previousMarkerId;

export const selectArticleFormIsDraft = (state: ArticleFormRootState) =>
  state.articleForm.isDraft;
