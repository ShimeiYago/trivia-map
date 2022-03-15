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
} from 'store/article-form/selector';
import {
  fetchArticle,
  initialize,
  submitEdittedArticle,
  submitNewArticle,
  updatePosition,
  updateTitle,
  updateContent,
  updateIsEditting,
} from 'store/article-form/actions';
import { Position } from 'types/position';

export function ArticleForm(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    postId: ownProps.postId,
    title: useAppSelector(selectArticleFormTitle),
    content: useAppSelector(selectArticleFormContent),
    position: useAppSelector(selectArticleFormPosition),
    submittingState: useAppSelector(selectArticleFormSubmittingState),
    fetchingState: useAppSelector(selectArticleFormFetchingState),
    formError: useAppSelector(selectArticleFormFormError),
    isFormEditting: useAppSelector(selectArticleFormIsEditting),

    updateTitle: (title: string) => dispatch(updateTitle(title)),
    updateContent: (content: string) => dispatch(updateContent(content)),
    updatePosition: (position: Position) => dispatch(updatePosition(position)),
    submitNewArticle: () => dispatch(submitNewArticle()),
    submitEdittedArticle: () => dispatch(submitEdittedArticle()),
    fetchArticle: (postId: string) => dispatch(fetchArticle(postId)),
    initialize: () => dispatch(initialize()),
    handleClickSelectPosition: ownProps.onClickSelectPosition,
    updateIsEditting: (isEditting: boolean) =>
      dispatch(updateIsEditting(isEditting)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  postId?: string;
  onClickSelectPosition?: () => void;
};
