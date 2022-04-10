import {
  selectArticleFormContent,
  selectArticleFormId,
  selectArticleFormTitle,
  selectArticleFormSubmittingState,
  selectArticleFormPosition,
  selectArticleFormFetchingState,
  selectArticleFormFormError,
  selectArticleFormIsEditting,
  selectArticleFormFetchingErrorMsg,
} from '..';
import { ArticleFormState, FormError } from '../../model';

const formError: FormError = {
  errorTitle: 'Inputted contents is invalid.',
  headerErrors: ['A error is in title.'],
};

describe('readingArticle selector', () => {
  const rootState = {
    articleForm: {
      postId: 'post-id',
      title: 'title',
      content: 'content',
      position: { lat: 1, lng: 1 },
      submittingState: 'success',
      fetchingState: 'success',
      formError: formError,
      isEditting: false,
      fetchingErrorMsg: 'fetch error',
    } as ArticleFormState,
  };

  it('selectArticleFormId should return articleForm id', () => {
    expect(selectArticleFormId(rootState)).toEqual('post-id');
  });

  it('selectArticleFormTitle should return articleForm title', () => {
    expect(selectArticleFormTitle(rootState)).toEqual('title');
  });

  it('selectArticleFormContent should return articleForm content', () => {
    expect(selectArticleFormContent(rootState)).toEqual('content');
  });

  it('selectArticleFormPosition should return articleForm position', () => {
    expect(selectArticleFormPosition(rootState)).toEqual({ lat: 1, lng: 1 });
  });

  it('selectArticleFormSubmittingState should return articleForm submittingState', () => {
    expect(selectArticleFormSubmittingState(rootState)).toEqual('success');
  });

  it('selectArticleFormFetchingState should return articleForm fetchingState', () => {
    expect(selectArticleFormFetchingState(rootState)).toEqual('success');
  });

  it('selectArticleFormFormError should return articleForm formError', () => {
    expect(selectArticleFormFormError(rootState)).toEqual(formError);
  });

  it('selectArticleFormIsEditting should return articleForm isEditting state', () => {
    expect(selectArticleFormIsEditting(rootState)).toEqual(false);
  });

  it('selectArticleFormFetchingErrorMsg should return articleForm fetchingErrorMsg state', () => {
    expect(selectArticleFormFetchingErrorMsg(rootState)).toEqual('fetch error');
  });
});
