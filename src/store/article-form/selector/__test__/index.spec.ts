import {
  selectArticleFormDescription,
  selectArticleFormId,
  selectArticleFormTitle,
  selectArticleFormSubmittingState,
  selectArticleFormPosition,
  selectArticleFormFetchingState,
  selectArticleFormFormError,
  selectArticleFormIsEditting,
  selectArticleFormLastSavedTitle,
  selectArticleFormLastSavedDescription,
  selectArticleFormLastSavedPosition,
  selectArticleFormIsFormChangedFromLastSaved,
  selectArticleFormImage,
  selectArticleFormLastSavedImage,
  selectArticleFormIsDraft,
  selectArticleFormCategory,
  selectArticleFormLastSavedCategory,
  selectArticleFormAreaNames,
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
      areaNames: ['シー', 'メディテレーニアンハーバー', 'ポルトパラディーゾ'],
      lastSavedPosition: { lat: 1, lng: 1 },
      image: 'https://image-data.jpg',
      lastSavedImage: 'https://image-data.jpg',
      category: 1,
      lastSavedCategory: 1,
      submittingState: 'success',
      fetchingState: 'success',
      formError: formError,
      isEditting: false,
      isFormChangedFromLastSaved: false,
      isDraft: true,
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

  it('selectArticleFormAreaNames should return articleForm areaNames', () => {
    expect(selectArticleFormAreaNames(rootState)).toEqual([
      'シー',
      'メディテレーニアンハーバー',
      'ポルトパラディーゾ',
    ]);
  });

  it('selectArticleFormImage should return articleForm image', () => {
    expect(selectArticleFormImage(rootState)).toEqual('https://image-data.jpg');
  });

  it('selectArticleFormLastSavedImage should return articleForm image', () => {
    expect(selectArticleFormLastSavedImage(rootState)).toEqual(
      'https://image-data.jpg',
    );
  });

  it('selectArticleFormCategory should return articleForm category', () => {
    expect(selectArticleFormCategory(rootState)).toEqual(1);
  });

  it('selectArticleFormLastSavedCategory should return articleForm last saved category', () => {
    expect(selectArticleFormLastSavedCategory(rootState)).toEqual(1);
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

  it('selectArticleFormIsFormChangedFromLastSaved should return articleForm isFormChangedFromLastSaved state', () => {
    expect(selectArticleFormIsFormChangedFromLastSaved(rootState)).toEqual(
      false,
    );
  });

  it('selectArticleFormIsDraft should return articleForm isDraft state', () => {
    expect(selectArticleFormIsDraft(rootState)).toEqual(true);
  });
});
