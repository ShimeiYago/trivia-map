import { articleFormReducer, articleFormSlice } from '..';
import { FormError, initialState } from '../../model';

const {
  updateTitle,
  updateContent,
  updatePosition,
  submitStart,
  submitFailure,
  submitSuccess,
  fetchStart,
  fetchFailure,
  fetchSuccess,
  initialize,
  updateIsEditting,
  updateLastSavedValues,
  updateIsFormChangedFromLastSaved,
} = articleFormSlice.actions;

describe('articleForm reducer', () => {
  const submittingLoadingState = JSON.parse(JSON.stringify(initialState));
  submittingLoadingState.submittingState = 'loading';

  const fetchingLoadingState = JSON.parse(JSON.stringify(initialState));
  fetchingLoadingState.fetchingState = 'loading';

  const formError: FormError = {
    errorTitle: 'Inputted contents is invalid.',
    headerErrors: ['A error is in title.'],
  };

  it('should handle initial state', () => {
    expect(articleFormReducer(undefined, { type: 'unknown' })).toEqual({
      title: '',
      content: '',
      lastSavedTitle: '',
      lastSavedContent: '',
      submittingState: 'waiting',
      fetchingState: 'waiting',
      isEditting: false,
      isFormChangedFromLastSaved: false,
    });
  });

  it('should handle updateTitle', () => {
    const actual = articleFormReducer(initialState, updateTitle('title'));
    expect(actual.title).toEqual('title');
  });

  it('should handle updateContent', () => {
    const actual = articleFormReducer(initialState, updateContent('content'));
    expect(actual.content).toEqual('content');
  });

  it('should handle updatePosition', () => {
    const actual = articleFormReducer(
      initialState,
      updatePosition({ lat: 1, lng: 1 }),
    );
    expect(actual.position).toEqual({ lat: 1, lng: 1 });
  });

  it('should handle submitStart', () => {
    const actual = articleFormReducer(initialState, submitStart());
    expect(actual.submittingState).toEqual('loading');
  });

  it('should handle submitFailure', () => {
    const actual = articleFormReducer(
      submittingLoadingState,
      submitFailure(formError),
    );
    expect(actual.submittingState).toEqual('error');
    expect(actual.formError).toEqual(formError);
  });

  it('should handle submitSuccess', () => {
    const actual = articleFormReducer(
      submittingLoadingState,
      submitSuccess('newPostId-000'),
    );
    expect(actual.submittingState).toEqual('success');
    expect(actual.postId).toEqual('newPostId-000');
  });

  it('should handle fetchStart', () => {
    const actual = articleFormReducer(initialState, fetchStart('postId-000'));
    expect(actual.postId).toEqual('postId-000');
  });

  it('should handle fetchFailure', () => {
    const actual = articleFormReducer(
      fetchingLoadingState,
      fetchFailure('fetch error'),
    );
    expect(actual.fetchingState).toEqual('error');
    expect(actual.fetchingErrorMsg).toEqual('fetch error');
  });

  it('should handle fetchSuccess', () => {
    const res = {
      title: 'title',
      content: 'content',
      position: { lat: 0, lng: 0 },
    };
    const actual = articleFormReducer(fetchingLoadingState, fetchSuccess(res));
    expect(actual.fetchingState).toEqual('success');
    expect(actual.title).toEqual(res.title);
    expect(actual.content).toEqual(res.content);
    expect(actual.position).toEqual(res.position);
  });

  it('should handle initialize', () => {
    const actual = articleFormReducer(fetchingLoadingState, initialize());
    expect(actual).toEqual(initialState);
  });

  it('should handle updateIsEditting', () => {
    const actual = articleFormReducer(
      fetchingLoadingState,
      updateIsEditting(true),
    );
    expect(actual.isEditting).toEqual(true);
  });

  it('should handle updateLastSavedValues', () => {
    const edittedState = JSON.parse(JSON.stringify(initialState));
    edittedState.title = 'new title';
    edittedState.content = 'new content';
    edittedState.position = { lat: 0, lng: 0 };

    const actual = articleFormReducer(edittedState, updateLastSavedValues());
    expect(actual.lastSavedTitle).toEqual('new title');
    expect(actual.lastSavedContent).toEqual('new content');
    expect(actual.lastSavedPosition).toEqual({ lat: 0, lng: 0 });
  });

  it('should handle updateIsFormChangedFromLastSaved', () => {
    const actual = articleFormReducer(
      initialState,
      updateIsFormChangedFromLastSaved(),
    );
    expect(actual.isFormChangedFromLastSaved).toBeFalsy;
  });
});
