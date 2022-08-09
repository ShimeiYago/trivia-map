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
  selectArticleFormIsDraft,
  selectArticleFormCategory,
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
import { toggleFormModal } from 'store/auths/actions';
import { selectUser } from 'store/auths/selector';

export function ArticleForm(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    postId: ownProps.postId,
    title: useAppSelector(selectArticleFormTitle),
    description: useAppSelector(selectArticleFormDescription),
    position: useAppSelector(selectArticleFormPosition),
    isDraft: useAppSelector(selectArticleFormIsDraft),
    imageDataUrl: useAppSelector(selectArticleFormImageDataUrl),
    category: useAppSelector(selectArticleFormCategory),
    submittingState: useAppSelector(selectArticleFormSubmittingState),
    fetchingState: useAppSelector(selectArticleFormFetchingState),
    formError: useAppSelector(selectArticleFormFormError),
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    userInfo: useAppSelector(selectUser),

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
    toggleAuthFormModal: (open: boolean) => dispatch(toggleFormModal(open)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  postId?: number;
  onClickSelectPosition?: () => void;
  onClose?: () => void;
};
