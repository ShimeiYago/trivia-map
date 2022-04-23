import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectArticleFormContent,
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
    content: useAppSelector(selectArticleFormContent),
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
    fetchArticle: (postId: string) => dispatch(fetchArticle(postId)),
    initialize: () => dispatch(initialize()),
    handleClickSelectPosition: ownProps.onClickSelectPosition,
    updateIsEditting: (isEditting: boolean) =>
      dispatch(updateIsEditting(isEditting)),
    onClose: ownProps.onClose,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  postId?: string;
  onClickSelectPosition?: () => void;
  onClose?: () => void;
};
