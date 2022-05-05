import { RootState } from 'store';

type ReadingArticleRootState = Pick<RootState, 'readingArticle'>;

export const selectReadingArticleId = (state: ReadingArticleRootState) =>
  state.readingArticle.postId;
export const selectReadingArticleTitle = (state: ReadingArticleRootState) =>
  state.readingArticle.title;
export const selectReadingArticleContent = (state: ReadingArticleRootState) =>
  state.readingArticle.content;
export const selectReadingArticlePosition = (state: ReadingArticleRootState) =>
  state.readingArticle.position;
export const selectReadingArticleImageUrl = (state: ReadingArticleRootState) =>
  state.readingArticle.imageUrl;
export const selectReadingArticleUserId = (state: ReadingArticleRootState) =>
  state.readingArticle.userId;
export const selectReadingArticleUserName = (state: ReadingArticleRootState) =>
  state.readingArticle.userName;
export const selectReadingArticleCreatedAt = (state: ReadingArticleRootState) =>
  state.readingArticle.createdAt;
export const selectReadingArticleUpdatedAt = (state: ReadingArticleRootState) =>
  state.readingArticle.updatedAt;
export const selectReadingArticleLoadingState = (
  state: ReadingArticleRootState,
) => state.readingArticle.loadingState;
export const selectReadingArticleErrorMsg = (state: ReadingArticleRootState) =>
  state.readingArticle.errorMsg;
