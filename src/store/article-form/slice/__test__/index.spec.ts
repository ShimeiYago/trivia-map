import { GetArticleResponse } from 'api/articles-api/get-remote-article';
import { articleFormReducer, articleFormSlice } from '..';
import { ArticleFormState, FormError, initialState } from '../../model';

const {
  updateTitle,
  updateDescription,
  updatePosition,
  submitStart,
  submitFailure,
  submitSuccess,
  fetchStart,
  fetchSuccess,
  initialize,
  updateIsEditting,
  updateLastSavedValues,
  updateIsFormChangedFromLastSaved,
  updateImage,
  updateIsDraft,
  updateCategory,
  updateAreaNames,
} = articleFormSlice.actions;

const stateWithValidation: ArticleFormState = {
  ...initialState,
  formError: {
    errorTitle: 'xxx',
    fieldErrors: {
      title: ['xxx'],
      description: ['xxx'],
      image: ['xxx'],
      marker: ['xxx'],
    },
  },
};

describe('articleForm reducer', () => {
  const submittingLoadingState = JSON.parse(JSON.stringify(initialState));
  submittingLoadingState.submittingState = 'loading';

  const fetchingLoadingState = JSON.parse(JSON.stringify(initialState));
  fetchingLoadingState.fetchingState = 'loading';

  const formError: FormError = {
    errorTitle: 'Inputted descriptions is invalid.',
  };

  it('should handle initial state', () => {
    expect(articleFormReducer(undefined, { type: 'unknown' })).toEqual({
      title: '',
      description: '',
      image: null,
      lastSavedTitle: '',
      lastSavedDescription: '',
      lastSavedImage: null,
      submittingState: 'waiting',
      fetchingState: 'waiting',
      isEditting: false,
      isFormChangedFromLastSaved: false,
      isDraft: false,
    });
  });

  it('should handle updateTitle', () => {
    const actual = articleFormReducer(initialState, updateTitle('title'));
    expect(actual.title).toEqual('title');
  });

  it('updateTitle initialize title formError', () => {
    const actual = articleFormReducer(stateWithValidation, updateTitle('title'));
    expect(actual.formError?.fieldErrors).toEqual({
      description: ['xxx'],
      image: ['xxx'],
      marker: ['xxx'],
    });
  });

  it('should handle updateDescription', () => {
    const actual = articleFormReducer(initialState, updateDescription('description'));
    expect(actual.description).toEqual('description');
  });

  it('updateDescription initialize description formError', () => {
    const actual = articleFormReducer(stateWithValidation, updateDescription('description'));
    expect(actual.formError?.fieldErrors).toEqual({
      title: ['xxx'],
      image: ['xxx'],
      marker: ['xxx'],
    });
  });

  it('should handle updatePosition', () => {
    const actual = articleFormReducer(
      initialState,
      updatePosition({
        lat: 1,
        lng: 1,
        park: 'S',
      }),
    );
    expect(actual.position).toEqual({ lat: 1, lng: 1, park: 'S' });
  });

  it('updatePosition initialize marker formError', () => {
    const actual = articleFormReducer(
      stateWithValidation,
      updatePosition({
        lat: 1,
        lng: 1,
        park: 'S',
      }),
    );
    expect(actual.formError?.fieldErrors).toEqual({
      title: ['xxx'],
      description: ['xxx'],
      image: ['xxx'],
    });
  });

  it('should handle updateImageDataUrl', () => {
    const actual = articleFormReducer(initialState, updateImage('https://image-data.jpg'));
    expect(actual.image).toEqual('https://image-data.jpg');
  });

  it('updateImageDataUrl initialize image formError', () => {
    const actual = articleFormReducer(stateWithValidation, updateImage('https://image-data.jpg'));
    expect(actual.formError?.fieldErrors).toEqual({
      title: ['xxx'],
      description: ['xxx'],
      marker: ['xxx'],
    });
  });

  it('should handle updateCategory', () => {
    const actual = articleFormReducer(initialState, updateCategory(1));
    expect(actual.category).toEqual(1);
  });

  it('should handle updateIsDraft', () => {
    const actual = articleFormReducer(initialState, updateIsDraft(true));
    expect(actual.isDraft).toBeTruthy();
  });

  it('should handle submitStart', () => {
    const actual = articleFormReducer(initialState, submitStart());
    expect(actual.submittingState).toEqual('loading');
  });

  it('should handle submitFailure', () => {
    const actual = articleFormReducer(submittingLoadingState, submitFailure(formError));
    expect(actual.submittingState).toEqual('error');
    expect(actual.formError).toEqual(formError);
  });

  it('should handle submitSuccess', () => {
    const actual = articleFormReducer(submittingLoadingState, submitSuccess(100));
    expect(actual.submittingState).toEqual('success');
    expect(actual.submitSuccessId).toEqual(100);
  });

  it('should handle fetchStart', () => {
    const actual = articleFormReducer(initialState, fetchStart(100));
    expect(actual.postId).toEqual(100);
  });

  it('should handle fetchSuccess', () => {
    const res: GetArticleResponse = {
      postId: 1,
      title: 'title',
      description: 'description',
      marker: {
        markerId: 1,
        lat: 0,
        lng: 0,
        park: 'S',
        numberOfPublicArticles: { total: 4, eachCategory: [1, 2, 1] },
        areaNames: ['xxx', 'yyy'],
      },
      image: 'https://image-data.jpg',
      isDraft: false,
      author: {
        userId: 1,
        nickname: 'Axel',
        icon: null,
        url: null,
      },
      category: 1,
      createdAt: '2022/4/1',
      updatedAt: '2022/5/1',
      numberOfLikes: 1,
    };
    const actual = articleFormReducer(fetchingLoadingState, fetchSuccess(res));
    expect(actual.fetchingState).toEqual('success');
    expect(actual.title).toEqual(res.title);
    expect(actual.description).toEqual(res.description);
    expect(actual.position).toEqual(res.marker);
    expect(actual.areaNames).toEqual(res.marker.areaNames);
    expect(actual.image).toEqual(res.image);
  });

  it('should handle initialize', () => {
    const actual = articleFormReducer(fetchingLoadingState, initialize());
    expect(actual).toEqual(initialState);
  });

  it('should handle updateIsEditting', () => {
    const actual = articleFormReducer(fetchingLoadingState, updateIsEditting(true));
    expect(actual.isEditting).toEqual(true);
  });

  it('should handle updateLastSavedValues', () => {
    const edittedState = JSON.parse(JSON.stringify(initialState));
    edittedState.title = 'new title';
    edittedState.description = 'new description';
    edittedState.position = { lat: 0, lng: 0 };
    edittedState.image = 'https://image-data.jpg';

    const actual = articleFormReducer(edittedState, updateLastSavedValues());
    expect(actual.lastSavedTitle).toEqual('new title');
    expect(actual.lastSavedDescription).toEqual('new description');
    expect(actual.lastSavedPosition).toEqual({ lat: 0, lng: 0 });
    expect(actual.lastSavedImage).toEqual('https://image-data.jpg');
  });

  it('should handle updateIsFormChangedFromLastSaved', () => {
    const actual = articleFormReducer(initialState, updateIsFormChangedFromLastSaved());
    expect(actual.isFormChangedFromLastSaved).toBeFalsy;
  });

  it('should handle updateAreaNames', () => {
    const actual = articleFormReducer(initialState, updateAreaNames(['xxx', 'yyy']));
    expect(actual.areaNames).toEqual(['xxx', 'yyy']);
  });
});
