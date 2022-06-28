import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectArticleFormDescription,
  selectArticleFormFetchingState,
  selectArticleFormFormError,
  selectArticleFormPosition,
  selectArticleFormSubmittingState,
  selectArticleFormTitle,
  selectArticleFormIsEditting,
  selectArticleFormImageDataUrl,
} from 'store/article-form/selector';
import {
  fetchArticle,
  initialize,
  submitEdittedArticle,
  submitNewArticle,
  updateIsEditting,
  updateFormField,
  UpdateFormFieldParam,
} from 'store/article-form/actions';

export function ArticleForm(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    postId: ownProps.postId,
    title: useAppSelector(selectArticleFormTitle),
    description: useAppSelector(selectArticleFormDescription),
    position: useAppSelector(selectArticleFormPosition),
    imageDataUrl: useAppSelector(selectArticleFormImageDataUrl),
    submittingState: useAppSelector(selectArticleFormSubmittingState),
    fetchingState: useAppSelector(selectArticleFormFetchingState),
    formError: useAppSelector(selectArticleFormFormError),
    isFormEditting: useAppSelector(selectArticleFormIsEditting),

    updateFormField: (param: UpdateFormFieldParam) =>
      dispatch(updateFormField(param)),
    submitNewArticle: () => dispatch(submitNewArticle()),
    submitEdittedArticle: () => dispatch(submitEdittedArticle()),
    fetchArticle: (postId: number) => dispatch(fetchArticle(postId)),
    initialize: () => dispatch(initialize()),
    handleClickSelectPosition: ownProps.onClickSelectPosition,
    updateIsEditting: (isEditting: boolean) =>
      dispatch(updateIsEditting(isEditting)),
    onClose: ownProps.onClose,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  postId?: number;
  onClickSelectPosition?: () => void;
  onClose?: () => void;
};
