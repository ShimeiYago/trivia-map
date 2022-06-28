import {
  selectArticleFormDescription,
  selectArticleFormId,
  selectArticleFormTitle,
  selectArticleFormSubmittingState,
  selectArticleFormPosition,
  selectArticleFormFetchingState,
  selectArticleFormFormError,
  selectArticleFormIsEditting,
  selectArticleFormFetchingErrorMsg,
  selectArticleFormLastSavedTitle,
  selectArticleFormLastSavedDescription,
  selectArticleFormLastSavedPosition,
  selectArticleFormIsFormChangedFromLastSaved,
  selectArticleFormImageDataUrl,
  selectArticleFormLastSavedImageDataUrl,
} from '..';
import { ArticleFormState, FormError } from '../../model';

const formError: FormError = {
  errorTitle: 'Inputted descriptions is invalid.',
};

describe('readingArticle selector', () => {
  const rootState = {
    articleForm: {
      postId: 100,
      title: 'title',
      lastSavedTitle: 'title',
      description: 'description',
      lastSavedDescription: 'description',
      position: { lat: 1, lng: 1 },
      lastSavedPosition: { lat: 1, lng: 1 },
      imageDataUrl: 'https://image-data.jpg',
      lastSavedImageDataUrl: 'https://image-data.jpg',
      submittingState: 'success',
      fetchingState: 'success',
      formError: formError,
      isEditting: false,
      fetchingErrorMsg: 'fetch error',
      isFormChangedFromLastSaved: false,
    } as ArticleFormState,
  };

  it('selectArticleFormId should return articleForm id', () => {
    expect(selectArticleFormId(rootState)).toEqual(100);
  });

  it('selectArticleFormTitle should return articleForm title', () => {
    expect(selectArticleFormTitle(rootState)).toEqual('title');
  });

  it('selectArticleFormLastSavedTitle should return articleForm title', () => {
    expect(selectArticleFormLastSavedTitle(rootState)).toEqual('title');
  });

  it('selectArticleFormDescription should return articleForm description', () => {
    expect(selectArticleFormDescription(rootState)).toEqual('description');
  });

  it('selectArticleFormLastSavedDescription should return articleForm description', () => {
    expect(selectArticleFormLastSavedDescription(rootState)).toEqual(
      'description',
    );
  });

  it('selectArticleFormPosition should return articleForm position', () => {
    expect(selectArticleFormPosition(rootState)).toEqual({ lat: 1, lng: 1 });
  });

  it('selectArticleFormLastSavedPosition should return articleForm submittingState', () => {
    expect(selectArticleFormLastSavedPosition(rootState)).toEqual({
      lat: 1,
      lng: 1,
    });
  });

  it('selectArticleFormImageDataUrl should return articleForm imageDataUrl', () => {
    expect(selectArticleFormImageDataUrl(rootState)).toEqual(
      'https://image-data.jpg',
    );
  });

  it('selectArticleFormLastSavedImageDataUrl should return articleForm imageDataUrl', () => {
    expect(selectArticleFormLastSavedImageDataUrl(rootState)).toEqual(
      'https://image-data.jpg',
    );
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

  it('selectArticleFormIsFormChangedFromLastSaved should return articleForm isFormChangedFromLastSaved state', () => {
    expect(selectArticleFormIsFormChangedFromLastSaved(rootState)).toEqual(
      false,
    );
  });
});
